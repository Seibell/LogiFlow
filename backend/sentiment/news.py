import requests
from bs4 import BeautifulSoup

# Function to assign sentiment scores to news articles from the Maritime Executive website
def scrape_maritime_executive_news():
    base_url = "https://www.joc.com/maritime/ports"
    news_list = []

    # Define a dictionary of high-risk keywords and their corresponding sentiment scores
    high_risk_keywords = {
    "war": 10,
    "drought": 8,
    "floods": 8,
    "container shortage": 9,
    "natural disaster": 8,
    "supply chain disruption": 9,
    "terrorist threat": 9,
    "labor strike": 7,
    "cybersecurity breach": 9,
    "cargo theft": 7,
    "piracy": 8,
    "economic crisis": 8,
    "trade sanctions": 7,
    "port congestion": 8,
    "oil spill": 9,
    "hurricane": 8,
    "earthquake": 8,
    "tsunami": 9,
    "pandemic": 9,
    "political unrest": 8,
    "customs delays": 7,
    "tariffs": 7,
    "cargo damage": 7,
    "strategic partnership": 6,
    "security breach": 8,
    "corruption": 7,
    "environmental regulations": 6,
    "stowaway": 7,
    "corporate scandal": 7,
    "port closure": 9,
    "trade dispute": 7,
    "economic downturn": 8,
    "protest": 7,
    "currency devaluation": 8,
    "hijacking": 8,
    "nuclear threat": 9,
    "terrorist attack": 10,
    "government intervention": 7,
    "recession": 8,
    "natural gas shortage": 8,
    "port labor issues": 7,
    "wildfire": 8,
    "vessel collision": 8,
    "chemical spill": 9,
    "oil price volatility": 7,
    "explosion": 8,
    "food safety recall": 7,
    "tornado": 8,
    "border closure": 9,
    "economic sanctions": 8,
    "political instability": 8,
    "currency crisis": 8,
}



    for page in range(1, 6):  # Adjust the range based on the number of pages you want to scrape
        url = f"{base_url}?page={page}"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        
        articles = soup.find_all("h3", class_="c-article-block__title")

        for article in articles:
            headline = article.text.strip()

            # Initialize the sentiment score to a default value (e.g., 5)
            sentiment_score = 5

            # Check for high-risk keywords and update the sentiment score accordingly
            for keyword, score in high_risk_keywords.items():
                if keyword.lower() in headline.lower():
                    sentiment_score = score
                    break  # Exit the loop if a high-risk keyword is found

            news_list.append({"headline": headline, "sentiment_score": sentiment_score})


    return news_list

import requests
from bs4 import BeautifulSoup
import random

# Function to assign sentiment scores to news articles from the Maritime Executive website
def scrape_maritime_executive_news():
    base_url = "https://www.joc.com/maritime/ports"
    news_list = []

    # Define a dictionary of high-risk keywords with potential variability in scores
    high_risk_keywords = {
        "war": random.uniform(8, 10),
        "drought": random.uniform(7, 9),
        "floods": random.uniform(7, 9),
        "container shortage": random.uniform(8, 10),
        "natural disaster": random.uniform(7, 9),
        "supply chain disruption": random.uniform(8, 10),
        "terrorist threat": random.uniform(8, 10),
        "labor strike": random.uniform(6, 8),
        "cybersecurity breach": random.uniform(8, 10),
        "cargo theft": random.uniform(6, 8),
        "piracy": random.uniform(7, 9),
        "economic crisis": random.uniform(7, 9),
        "trade sanctions": random.uniform(6, 8),
        "port congestion": random.uniform(7, 9),
        "oil spill": random.uniform(8, 10),
        "hurricane": random.uniform(7, 9),
        "earthquake": random.uniform(7, 9),
        "tsunami": random.uniform(8, 10),
        "pandemic": random.uniform(8, 10),
        "political unrest": random.uniform(7, 9),
        "customs delays": random.uniform(6, 8),
        "tariffs": random.uniform(6, 8),
        "cargo damage": random.uniform(6, 8),
        "strategic partnership": random.uniform(5, 7),
        "security breach": random.uniform(7, 9),
        "corruption": random.uniform(6, 8),
        "environmental regulations": random.uniform(5, 7),
        "stowaway": random.uniform(6, 8),
        "corporate scandal": random.uniform(6, 8),
        "port closure": random.uniform(8, 10),
        "trade dispute": random.uniform(6, 8),
        "economic downturn": random.uniform(7, 9),
        "protest": random.uniform(6, 8),
        "currency devaluation": random.uniform(7, 9),
        "hijacking": random.uniform(7, 9),
        "nuclear threat": random.uniform(8, 10),
        "terrorist attack": random.uniform(9, 10),
        "government intervention": random.uniform(6, 8),
        "recession": random.uniform(7, 9),
        "natural gas shortage": random.uniform(7, 9),
        "port labor issues": random.uniform(6, 8),
        "wildfire": random.uniform(7, 9),
        "vessel collision": random.uniform(7, 9),
        "chemical spill": random.uniform(8, 10),
        "oil price volatility": random.uniform(6, 8),
        "explosion": random.uniform(7, 9),
        "food safety recall": random.uniform(6, 8),
        "tornado": random.uniform(7, 9),
        "border closure": random.uniform(8, 10),
        "economic sanctions": random.uniform(7, 9),
        "political instability": random.uniform(7, 9),
        "currency crisis": random.uniform(7, 9),
    }

    for page in range(1, 6):  # Adjust the range based on the number of pages you want to scrape
        url = f"{base_url}?page={page}"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        
        articles = soup.find_all("h3", class_="c-article-block__title")
        dates = soup.find_all("p", class_="c-article-block__meta")
        print(dates)

        for index, article in enumerate(articles):
            headline = article.text.strip()

            # Initialize the sentiment score to a default value (e.g., 5)
            sentiment_score = random.uniform(1, 5)  # Random score between 1 and 10
            date = dates[index].text.strip().split('|')[1].strip()

            # Check for high-risk keywords and update the sentiment score accordingly
            for keyword, score in high_risk_keywords.items():
                if keyword.lower() in headline.lower():
                    sentiment_score = score
                    break  # Exit the loop if a high-risk keyword is found

            news_list.append({"headline": headline, "sentiment_score": round(sentiment_score,2), "date":date})

    return news_list


