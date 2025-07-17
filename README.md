# 🎬 Movie Recommendation System

The **Movie Recommendation System** is a user-friendly web application built using Flask that helps users discover new movies based on a single input — the title of a movie they like. It uses a content-based recommendation algorithm and integrates with the TMDb API to display posters and trailers, making your movie discovery process visually engaging and interactive.

---

## 🔑 Key Features

- 🎯 **Single Movie Input**: Just type the name of a movie you enjoy — like *Avatar* or *Titanic* — and instantly receive a curated list of similar films.
- 🤖 **Smart Recommendations**: Uses a content-based machine learning model to suggest movies with similar themes, genres, and styles.
- 📝 **Watchlist Management**: Logged-in users can save recommended movies to a personal watchlist to view or watch later.
- 🎞️ **Watch Trailers Instantly**: Get a glimpse of any recommended movie by watching its trailer directly from YouTube within the app.
- 🖼️ **Movie Posters from TMDb**: Visualize your recommendations with high-quality posters pulled directly from TMDb.
- 🔐 **User Authentication**: Secure signup and login for a personalized experience — your preferences and watchlist are stored securely.

---

## ⚙️ How It Works

1. **Enter a Movie Title**  
   Type in the name of a movie you like (e.g., *Avengers: Age of Ultron*, *Superman Returns*, or *Pirates of the Caribbean: At World's End*).

2. **View Recommendations**  
   The app suggests 5 similar movies using content-based filtering. Each result includes:
   - Poster image  
   - Genre  
   - Overview  
   - YouTube trailer

3. **Add to Watchlist**  
   Save recommended movies to your personal watchlist with a single click (available for logged-in users).

4. **Watch Trailers**  
   Preview any recommended movie before watching by clicking its embedded YouTube trailer.

---

## 🚀 Tech Stack

### 🖥️ Backend
- Flask
- SQLite
- Gunicorn

### 🎨 Frontend
- Jinja2
- HTML/CSS

### 📊 Data Processing & ML
- Pandas
- NumPy
- Scikit-learn (Cosine Similarity for content-based filtering)

### 🔌 API Integration
- [TMDb (The Movie Database)](https://www.themoviedb.org/documentation/api) for posters and trailers

---

## 📌 Note

⚠️ **Dataset Limitation**  
This system currently uses a fixed dataset of 5,000 movies. As a result:

- Recommendations are only available for movies present in this dataset.
- Movie matching is based on the exact movie title (from the `original_title` field in TMDb), so input must match exactly.
- If the movie title you enter is not in the dataset or is misspelled, you’ll receive a "Movie not found" message.

✅ **Examples of supported movie titles** include:
- *Avengers: Age of Ultron*
- *Avatar*
- *Titanic*
- *Superman Returns*
- *Pirates of the Caribbean: At World's End*
- *John Carter*
- ...and many more.

---

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/movie-recommendation-system.git
   cd movie-recommendation-system
   ```
2. **Create and activate a virtual environment**
``` bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
```
3. ** Install the dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Set up TMDb API key**
```bash 
   Create a .env file in the root directory and add:

   TMDB_API_KEY=your_tmdb_api_key_here
```
5. **Run the application**
```bash 
   python app.py
```
6.  **Visit in browser**
   ```bash
   http://127.0.0.1:5000
```

👥 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

Fork the repo

Create your feature branch (git checkout -b feature/YourFeature)

Commit your changes (git commit -m 'Add YourFeature')

Push to the branch (git push origin feature/YourFeature)

Open a Pull Request

---
📄 License

This project is licensed under the MIT License.

---
🙋‍♂️ Contact

For questions or support, reach out to vinayakkhandelwal34@gmail.com
   
   
