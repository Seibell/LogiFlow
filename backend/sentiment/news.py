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

