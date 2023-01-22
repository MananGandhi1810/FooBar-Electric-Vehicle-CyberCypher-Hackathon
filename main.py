from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

headers = {
    'authority': 'www.carwale.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'en-US,en-IN;q=0.9,en;q=0.8',
    'cache-control': 'max-age=0',
    'dnt': '1',
    'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
}

def search_cars(budget, bs, seat):
    req = requests.get("https://www.carwale.com/new/search/result/?fuel=5&bs=" + bs + "&budget=" + budget + "&seat=" + seat, headers = headers)
    escapes = ''.join([chr(char) for char in range(1, 32)])
    translator = str.maketrans('', '', escapes)
    soup = BeautifulSoup(req.text, 'html.parser')
    cars = soup.find_all("a", class_="href-title")
    price = soup.find_all("span", class_="new-price2")
    temp = 0
    dict = {}
    for i in range(len(cars)):
        car = cars[i].get_text().translate(translator)
        img = soup.find_all("img", alt = car)
        ratings = soup.find_all("img", class_= "text-bottom")
        final_rating = 0
        for x in range(0 + (5 * temp) , 5 + (5 * temp)):
            if ratings[x]['src'] == "https://imgd.aeplcdn.com/0x0/images/ratings/1.png":
                final_rating += 1
            elif ratings[x]['src'] == "https://imgd.aeplcdn.com/0x0/images/ratings/half.png":
                final_rating += 0.5
        dict[car] = [price[i].get_text(), img[0]['src'], str(final_rating) + " / 5"]
        temp += 1
    return dict

@app.route("/api/v1/search", methods=["POST"])
def search():
    return search_cars(request.json["budget"], request.json["bodystyle"], request.json["seats"])

if __name__ == "__main__":
    app.run(host='0.0.0.0')
