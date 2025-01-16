import json
import requests
from flask import Flask, jsonify

app = Flask(__name__)

# Define the API URL for diabetes prevalence data from World Bank
url = "https://api.worldbank.org/v2/indicator/SH.STA.DIAB.ZS?date=2022&format=json"

# Retrieve data
response = requests.get(url)

# Check if request was successful
if response.status_code == 200:
    # Load the JSON response
    data = response.json()
    
    # Print the full raw response to inspect its structure
    print("Raw response data:")
    print(json.dumps(data, indent=2))  # Pretty-print the JSON for better readability
    
    # Extract diabetes prevalence data
    diabetes_data = {}
    if 'data' in data[2]:
        for entry in data[2]:
            country_name = entry['country']['value']  # Country name
            prevalence = entry['value']  # Diabetes prevalence
            if prevalence is not None:
                diabetes_data[country_name] = prevalence
    
    # Print the diabetes data for debugging
    print("Diabetes data retrieved successfully!")
    print(diabetes_data)  # This will print the data to the terminal
    
    # Define a Flask route to return the data
    @app.route('/api/diabetes', methods=['GET'])
    def get_diabetes_data():
        return jsonify(diabetes_data)

else:
    print(f"Failed to retrieve data: {response.status_code}, {response.text}")

if __name__ == '__main__':
    app.run(debug=True)
