from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import csv
import os
from service import stl, cf, init_models, retrain_stl
import logging
from datetime import date, timedelta
import pandas as pd
from sentiment.news import scrape_maritime_executive_news

logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)
CORS(app, origins="*", methods=['GET', 'POST', 'PUT', 'DELETE'])

# models
init_models()

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

@app.route('/', methods=['GET'])
def health():
    return jsonify({'message': 'OK'})

@app.route('/get_data/<column_name>', methods=['GET'])
def get_data_by_column(column_name):
    month = request.args.get('month')
    
    if column_name not in column_mapping:
        return jsonify({'error': 'Invalid column name'}), 400
    
    try:
        if month:
            # If the 'month' parameter is provided, filter data for that specific month
            data = df[df['Month'] == month][column_name].tolist()
            return jsonify({column_name: data})
        else:
            # If 'month' parameter is not provided, return the entire column data
            data = df[column_name].tolist()
            monthdata = df['Month'].tolist()
            return jsonify({column_name: data, 'Months':monthdata})
    except ValueError:
        return jsonify({'error': 'Invalid month value'}), 400


# returns message for format, data object {a,b}
@app.route('/cost_function', methods=['GET'])
def get_cost_function():
    a_constant, b_constant, latest_cost, slider_range = cf.get_function()
    res = {
        'a': a_constant,
        'b': b_constant,
        'latest_cost': latest_cost,
        'slider_range': slider_range
    }
    return jsonify({'message': 'formula is in the format `throughput = a*log(cost) + b`', 'data': res})

@app.route('/predict_cargo/<int:num_months>', methods=['GET'])
def predict_cargo_route(num_months):
    cargo_values, month_values, start_index, end_index = stl.predict(num_months)
    res = {
        'cargo': cargo_values,
        'month': month_values
    }
    return jsonify({'data': res, 'predicted_index': [start_index, end_index]})

@app.route('/predict_throughput/<int:num_months>', methods=['GET'])
def predict_throughput_route(num_months):
    estimated_throughput_values = predict_throughput(num_months)
    return jsonify({'estimated_throughput_values': estimated_throughput_values})

@app.route('/predict_congestion/<int:num_months>', methods=['GET'])
def predict_congestion_route(num_months):
    estimated_congestion_values = predict_congestion(num_months)
    return jsonify({'estimated_congestion_values': estimated_congestion_values})


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
        file_path = os.path.join("ml", "cargor_model_monthly_copy.csv")

        # Fetch the last row to compute the Month Rank
        with open(file_path, 'r') as csvfile:
            last_row = list(csv.reader(csvfile))[-1]
            month_rank = int(float(last_row[-1])) + 1
            id = int(last_row[0]) + 1

            # Extract the last month and year from the last row
            last_year_str, last_month_str = last_row[1].split()
            last_month_num = month_names.index(last_month_str) + 1 
            last_year_num = int(last_year_str)

        # Check if the uploaded month is the month immediately following the last recorded month
        if int(month) == (last_month_num % 12) + 1 and int(year) == (last_year_num + (last_month_num // 12)):
            pass
        else:
            return jsonify({"message": "You can only upload data for the month immediately after the last recorded month."}), 400
        
        
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

        retrain_stl()   # retrain the model
        return jsonify({"message": "Data uploaded successfully!"}), 200
    except Exception as e:
        logging.error("Exception occured", exc_info=True)
        return jsonify({"message": f"Error: {str(e)}"}), 500
    

@app.route('/get_latest_news', methods=['GET'])
def get_latest_news():
    # Call the scrape_maritime_executive_news() function from news.py
    news_data = scrape_maritime_executive_news()
    
    # Return the scraped data as JSON
    return jsonify(news_data)

if __name__ == '__main__':
    app.run(debug=True)
