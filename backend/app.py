import pandas as pd
from flask_cors import CORS
from flask import Flask, request, jsonify
import os

app = Flask(__name__)
CORS(app, origins="*", methods=['GET', 'POST', 'PUT', 'DELETE'])

# Load the CSV file into a DataFrame
csv_directory = os.path.join(os.path.dirname(__file__), 'ml')

# Load the CSV file into a DataFrame
csv_file_path = os.path.join(csv_directory, 'cargor_model_monthly.csv')
df = pd.read_csv(csv_file_path)

# Define a dictionary to map column names to their respective indices
column_mapping = {
    'Month': 1,
    'Vessel Arrivals (Number)': 2,
    'Vessel Arrivals - Shipping Tonnage (Thousand Gross Tonnes)': 3,
    'Total Cargo (Thousand Tonnes)': 4,
    'Cargo (General) (Thousand Tonnes)': 5,
    'Cargo (Bulk) (Thousand Tonnes)': 6,
    'Cargo (Oil-In-Bulk) (Thousand Tonnes)': 7,
    'Cargo (General & Non-Oil In Bulk) (Thousand Tonnes)': 8,
    'Total Container Throughput (Thousand Twenty-Foot Equivalent Units)': 9,
    'Bunker Sales (Thousand Tonnes)': 10,
    'Singapore Registry Of Ships (End Of Period) - Number (Number)': 11,
    "Singapore Registry Of Ships (End Of Period) - '000 GT (Thousand Gross Tonnes)": 12,
    'Month Val': 13,
    'Month Num': 14,
    'Year': 15,
    'Month Rank': 16
}

@app.route('/get_data/<column_name>', methods=['GET'])
def get_data_by_column(column_name):
    month = request.args.get('month')
    
    if column_name not in column_mapping:
        return jsonify({'error': 'Invalid column name'}), 400
    
    if month is None:
        return jsonify({'error': 'Month parameter is required'}), 400
    
    try:
        month_index = int(month)
        data = df[df['Month'] == month_index][column_name].tolist()
        return jsonify({column_name: data})
    except ValueError:
        return jsonify({'error': 'Invalid month value'}), 400

@app.route('/predict_cargo/<int:num_months>', methods=['GET'])
def predict_cargo_route(num_months):
    estimated_cargo_values = predict_cargo(num_months)
    return jsonify({'estimated_cargo_values': estimated_cargo_values})

@app.route('/predict_throughput/<int:num_months>', methods=['GET'])
def predict_throughput_route(num_months):
    estimated_throughput_values = predict_throughput(num_months)
    return jsonify({'estimated_throughput_values': estimated_throughput_values})

@app.route('/predict_congestion/<int:num_months>', methods=['GET'])
def predict_congestion_route(num_months):
    estimated_congestion_values = predict_congestion(num_months)
    return jsonify({'estimated_congestion_values': estimated_congestion_values})

def predict_cargo(num_months):
    # Implement cargo prediction logic for the specified number of months
    # Return the result as a list of estimated cargo values
    predicted_values = []  # Replace with your actual prediction logic
    return predicted_values

def predict_throughput(num_months):
    # Implement throughput prediction logic for the specified number of months
    # Return the result as a list of estimated throughput values
    predicted_values = []  # Replace with your actual prediction logic
    return predicted_values

def predict_congestion(num_months):
    # Implement congestion prediction logic for the specified number of months
    # Return the result as a list of estimated congestion values
    predicted_values = []  # Replace with your actual prediction logic
    return predicted_values

if __name__ == '__main__':
    app.run()
