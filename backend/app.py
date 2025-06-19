from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from bson import ObjectId
import json

app = Flask(__name__)
CORS(app)

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URI)
db = client['ski_resort_db']
resorts_collection = db['resorts']

# Helper function to convert ObjectId to string
def serialize_resort(resort):
    resort['_id'] = str(resort['_id'])
    return resort

# Routes
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "ski-resort-api"})

@app.route('/api/resorts', methods=['GET'])
def get_resorts():
    try:
        resorts = list(resorts_collection.find())
        return jsonify([serialize_resort(resort) for resort in resorts])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/resorts', methods=['POST'])
def create_resort():
    try:
        data = request.get_json()
        resort = {
            "name": data.get('name'),
            "location": data.get('location'),
            "slopes": int(data.get('slopes', 0)),
            "difficulty": data.get('difficulty', 'Beginner')
        }
        result = resorts_collection.insert_one(resort)
        resort['_id'] = str(result.inserted_id)
        return jsonify(resort), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/resorts/<resort_id>', methods=['PUT'])
def update_resort(resort_id):
    try:
        data = request.get_json()
        update_data = {
            "name": data.get('name'),
            "location": data.get('location'),
            "slopes": int(data.get('slopes', 0)),
            "difficulty": data.get('difficulty')
        }
        result = resorts_collection.update_one(
            {"_id": ObjectId(resort_id)},
            {"$set": update_data}
        )
        if result.matched_count:
            updated_resort = resorts_collection.find_one({"_id": ObjectId(resort_id)})
            return jsonify(serialize_resort(updated_resort))
        return jsonify({"error": "Resort not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/resorts/<resort_id>', methods=['DELETE'])
def delete_resort(resort_id):
    try:
        result = resorts_collection.delete_one({"_id": ObjectId(resort_id)})
        if result.deleted_count:
            return jsonify({"message": "Resort deleted successfully"})
        return jsonify({"error": "Resort not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)