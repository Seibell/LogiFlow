import requests
from bs4 import BeautifulSoup

# Function to scrape news articles from the Maritime Executive website
def scrape_maritime_executive_news():
    base_url = "https://www.joc.com/maritime/ports"
    news_list = []

    for page in range(1, 6):  # Adjust the range based on the number of pages you want to scrape
        url = f"{base_url}?page={page}"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        
        articles = soup.find_all("h3", class_="c-article-block__title")
        headlines = []
        for article in articles:
            headline = article.text.strip()
            headlines.append(headline)
            
        news_list.append({"headlines": headlines})

    return news_list

# Scrape news articles and store them in a DataFrame
news_data = scrape_maritime_executive_news()
print(news_data)

