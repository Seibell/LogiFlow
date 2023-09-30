from flask import Flask, jsonify, request
from flask_cors import CORS
import csv
import os
import logging

logging.basicConfig(level=logging.DEBUG)
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
        data = df[df['Month'] == month][column_name].tolist()
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

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify(message="Hello from Flask!")

@app.route('/api/upload', methods=['POST'])
def upload_data():
    try:
        data = request.json

        # Month names
        month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", 
                       "Oct", "Nov", "Dec"]
        
        # Extract year and month from the 'date' field
        year, month = data['date'].split('-')
        month_num = int(month)

        # Date conversion
        month_val = f"1/{month}/{year}"
        
        # File path
        file_path = os.path.join("ml", "cargor_model_monthly.csv")

        # Fetch the last row to compute the Month Rank
        with open(file_path, 'r') as csvfile:
            last_row = list(csv.reader(csvfile))[-1]
            month_rank = int(float(last_row[-1])) + 1
            id = int(last_row[0]) + 1
        
        # Append data to CSV
        with open(file_path, 'a', newline='') as csvfile:
            fieldnames = [
                'ID',
                'Month', 'Vessel Arrivals (Number)', 
                'Vessel Arrivals - Shipping Tonnage (Thousand Gross Tonnes)',
                'Total Cargo (Thousand Tonnes)', 'Cargo (General) (Thousand Tonnes)', 
                'Cargo (Bulk) (Thousand Tonnes)', 'Cargo (Oil-In-Bulk) (Thousand Tonnes)',
                'Cargo (General & Non-Oil In Bulk) (Thousand Tonnes)', 
                'Total Container Throughput (Thousand Twenty-Foot Equivalent Units)', 
                'Bunker Sales (Thousand Tonnes)', 
                'Singapore Registry Of Ships (End Of Period) - Number (Number)', 
                'Singapore Registry Of Ships (End Of Period) - \'000 GT (Thousand Gross Tonnes)',
                'Month Val', 'Month Num', 'Year', 'Month Rank'
            ]
            
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            # Convert data to the format needed for the CSV
            row = {
                "ID": id,
                "Month": f"{year} {month_names[int(month)-1]}",
                "Vessel Arrivals (Number)": data['vesselArrivals'],
                "Vessel Arrivals - Shipping Tonnage (Thousand Gross Tonnes)": data['vesselArrivalsShippingTonnage'],
                "Total Cargo (Thousand Tonnes)": data['totalCargoThousandTonnes'],
                "Cargo (General) (Thousand Tonnes)": data['cargoGeneralThousandTonnes'],
                "Cargo (Bulk) (Thousand Tonnes)": data['cargoBulkThousandTonnes'],
                "Cargo (Oil-In-Bulk) (Thousand Tonnes)": data['cargoOilInBulkThousandTonnes'],
                "Cargo (General & Non-Oil In Bulk) (Thousand Tonnes)": data['cargoGeneralAndNonOilInBulkThousandTonnes'],
                "Total Container Throughput (Thousand Twenty-Foot Equivalent Units)": data['totalContainerThroughput'],
                "Bunker Sales (Thousand Tonnes)": data['bunkerSalesThousandTonnes'],
                "Singapore Registry Of Ships (End Of Period) - Number (Number)": data['singaporeRegistryOfShipsNumber'],
                "Singapore Registry Of Ships (End Of Period) - '000 GT (Thousand Gross Tonnes)": data['singaporeRegistryOfShipsNumber000GT'],
                "Month Val": month_val,
                "Month Num": month_num,
                "Year": year,
                "Month Rank": month_rank
            }
            
            writer.writerow(row)

        return jsonify({"message": "Data uploaded successfully!"}), 200
    except Exception as e:
        logging.error("Exception occured", exc_info=True)
        return jsonify({"message": f"Error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
