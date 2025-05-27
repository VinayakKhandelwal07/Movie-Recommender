import sqlite3
from flask import Flask, redirect, request, render_template, session, flash, jsonify
import pickle
import requests
import pandas as pd
import logging
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'a6f34b7e993e4d5db8744a2f91e78d8e0a2b99f81f672c4e1536b34d947ee201'

# Initialize the database (from the database.py file you provided)
from database import init_db
init_db()

# Load the models
movies = pickle.load(open('models/movies_list.pkl', 'rb'))
similarity = pickle.load(open('models/similarity.pkl', 'rb'))

# Load the movie data
frontend_df = pd.read_csv('frontend_df.csv')

TMDB_API_KEY = "8265bd1679663a7ea12ac168da84d2e8"

# Fetch the movie poster

def fetch_poster(movie_id):
    try:
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&language=en-US"
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        if 'poster_path' in data and data['poster_path']:
            return f"https://image.tmdb.org/t/p/w500{data['poster_path']}"
        return "https://via.placeholder.com/500"
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching poster: {e}")
        return "https://via.placeholder.com/500"

# Fetch the movie trailer

def fetch_trailer(movie_id):
    try:
        url = f"https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key={TMDB_API_KEY}&language=en-US"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        for video in data.get('results', []):
            if video['type'] == 'Trailer':
                return f"https://www.youtube.com/watch?v={video['key']}"
        return None
    except:
        return None

# Movie recommendation logic
def recommend(movie): 
    try:
        index = movies[movies['original_title'] == movie].index[0]
    except IndexError:
        return [], [], [], [], []

    distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])

    recommended_movies_name = []
    recommended_movies_poster = []
    recommended_movies_overview = []
    recommended_movies_genres = []
    recommended_movies_trailer = []

    for i in distances[1:6]:
        movie_id = movies.iloc[i[0]].id
        recommended_movies_name.append(movies.iloc[i[0]].original_title)
        recommended_movies_poster.append(fetch_poster(movie_id))

        movie_info = frontend_df[frontend_df['id'] == movie_id].iloc[0]
        recommended_movies_overview.append(' '.join(movie_info['overview']))
        recommended_movies_genres.append(', '.join(movie_info['genres']))
        trailer_url = fetch_trailer(movie_id)
        recommended_movies_trailer.append(trailer_url if trailer_url else "No trailer available")

    return recommended_movies_name, recommended_movies_poster, recommended_movies_overview, recommended_movies_genres, recommended_movies_trailer

@app.route('/')
def index():
    return redirect('/signup_login')

@app.route('/signup_login', methods=['GET', 'POST'])
def signup_login():
    if request.method == 'POST':
        if 'signup' in request.form:
            username = request.form['username']
            email = request.form['email']
            password = generate_password_hash(request.form['password'])
            conn = sqlite3.connect('watchlist.db')
            cursor = conn.cursor()
            try:
                cursor.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                               (username, email, password))
                conn.commit()
            except sqlite3.IntegrityError:
                return "Username or email already exists"
            finally:
                conn.close()
            return redirect('/signup_login')

        elif 'login' in request.form:
            email = request.form['email']
            password = request.form['password']
            conn = sqlite3.connect('watchlist.db')
            cursor = conn.cursor()
            cursor.execute('SELECT id, password FROM users WHERE email = ?', (email,))
            user = cursor.fetchone()
            conn.close()
            if user and check_password_hash(user[1], password):
                session['user_id'] = user[0]
                flash('Successfully logged in!', 'success')
                return redirect('/home')
            else:
                flash('Invalid credentials, please try again.', 'danger')
                return redirect('/signup_login')
    return render_template('login.html')

@app.route('/home', methods=['GET', 'POST'])
def home():
    movie_list = movies['original_title'].values
    return render_template("home.html", movie_list=movie_list, status=False, error=None)

@app.route('/api/recommend')
def api_recommend():
    movie_name = request.args.get('movie')
    if not movie_name:
        return jsonify({"error": "No movie provided"}), 400
    try:
        names, posters, overviews, genres, trailers = recommend(movie_name)
        if not names:
            return jsonify({"error": "Movie not found or no recommendations."})
        results = []
        for i in range(len(names)):
            results.append({
                "title": names[i],
                "poster": posters[i],
                "overview": overviews[i],
                "genres": genres[i].split(', '),
                "trailer": trailers[i]
            })
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/watchlist')
def watchlist():
    if 'user_id' not in session:
        return redirect('/signup_login')
    user_id = session['user_id']
    conn = sqlite3.connect('watchlist.db')
    cursor = conn.cursor()
    cursor.execute('SELECT title, poster FROM watchlist WHERE user_id = ?', (user_id,))
    movies = cursor.fetchall()
    conn.close()
    return render_template('watchlist.html', movies=movies)

@app.route('/add_to_watchlist', methods=['POST'])
def add_to_watchlist():
    if 'user_id' not in session:
        return redirect('/signup_login')
    user_id = session['user_id']
    movie_id = request.form['movie_id']
    title = request.form['title']
    poster = request.form['poster']
    conn = sqlite3.connect('watchlist.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO watchlist (user_id, movie_id, title, poster)
        VALUES (?, ?, ?, ?)''', (user_id, movie_id, title, poster))
    conn.commit()
    conn.close()
    return redirect('/watchlist')

@app.route('/remove_from_watchlist', methods=['POST'])
def remove_from_watchlist():
    if 'user_id' not in session:
        return redirect('/signup_login')
    user_id = session['user_id']
    movie_id = request.form['movie_id']
    conn = sqlite3.connect('watchlist.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?', (user_id, movie_id))
    conn.commit()
    conn.close()
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
