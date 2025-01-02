from flask import Flask, request, jsonify
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import OneHotEncoder
from pymongo.mongo_client import MongoClient
from flask_cors import CORS
from sklearn.cluster import KMeans

#       Data from mongodb
uri = "mongodb+srv://duong3456789:1111@cluster0.x76l8mw.mongodb.net/fashion?retryWrites=true&w=majority"
client = MongoClient(uri)
db = client.fashion
collection = db.products
cursor = collection.find({})
df = pd.DataFrame(list(cursor))

#       Find k for the database
length_products = len(df)
k = max(1, int(length_products / 10))

#       Drop unnecessary properties
columns_to_drop = ['_id', '__v']
df = df.drop(columns_to_drop, axis=1)

#       Cosine similarity
encoder = OneHotEncoder()
encoded_categories = encoder.fit_transform(df[['category', 'season', 'label', 'color']]).toarray()
encoded_df = pd.concat([df[['id', 'price']], pd.DataFrame(encoded_categories)], axis=1)
cosine_sim = cosine_similarity(encoded_df.drop(columns=['id']), encoded_df.drop(columns=['id']))

#       Enable CORS
app = Flask(__name__)
cors = CORS(app, resources={r"/frombought": {"origins": "http://localhost:3000"}})
CORS(app)  

#       Define recommendation logic function
def content_based_recommendation(item_id, similarity_matrix, df, top_n=4):
    item_index = df[df['id'] == item_id].index[0]
    sim_scores = list(enumerate(similarity_matrix[item_index]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    top_similar_items = sim_scores[1:top_n+1]
    similar_items_info = [df.iloc[item[0]].to_dict() for item in top_similar_items]
    return similar_items_info

#       API for recommendation
@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    item_id = int(request.args.get('item_id'))
    if item_id is None:
        return jsonify({'error': 'Item ID is required'}), 400
    similar_items_info = content_based_recommendation(item_id, cosine_sim, df)

    return jsonify({'recommended_items': similar_items_info})


#       K-Means clustering
kmeans = KMeans(n_clusters=k, init='random', random_state=42)
encoded_df.columns = encoded_df.columns.astype(str)
kmeans.fit(encoded_df.drop('id', axis=1))
encoded_df['cluster'] = kmeans.predict(encoded_df.drop('id', axis=1))


#       API for recommendations from bought
@app.route('/frombought', methods=['POST'])
def recommendations_from_bought():
    bought_product_id = request.json['boughtProducts']
    bought_product_cluster = encoded_df[encoded_df['id'].isin(bought_product_id)]['cluster'].iloc[0]
    cluster_items = encoded_df[encoded_df['cluster'] == bought_product_cluster]
    recommendation_ids = cluster_items[~cluster_items['id'].isin(bought_product_id)]['id']
    recommendations = recommendation_ids.tolist()
    recommended_df = df[df['id'].isin(recommendations)]
    recommended_df = recommended_df.head(10)
    recommended_df_rand4 = recommended_df.sample(n=4)
    recommended_json = recommended_df_rand4.to_json(orient='records')
    
    return jsonify(recommended_json)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
