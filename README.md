🎬 Movie Recommendation System
The Movie Recommendation System is a user-friendly web application built with Flask that helps users discover new movies based on a single input — the title of a movie they like. It uses a content-based recommendation algorithm and integrates with TMDb API to display posters and trailers, making your movie discovery process visually engaging and interactive.

🔑 Key Features
🎯 Single Movie Input: Just type the name of a movie you enjoy — like Avatar or Titanic — and instantly receive a curated list of similar films.

🤖 Smart Recommendations: Uses a content-based machine learning model to suggest movies with similar themes, genres, and styles.

📝 Watchlist Management: Logged-in users can save recommended movies to a personal watchlist to view or watch later.

🎞️ Watch Trailers Instantly: Get a glimpse of any recommended movie by watching its trailer directly from YouTube within the app.

🖼️ Movie Posters from TMDb API: Visualize your recommendations with high-quality posters pulled directly from TMDb.

🔐 User Authentication: Secure signup and login for a personalized experience — your preferences and watchlist are stored securely.

⚙️ How It Works
Enter a Movie Title: e.g., Avengers: Age of Ultron, Superman Returns, or Pirates of the Caribbean: At World's End.

View Recommendations: The app suggests 5 similar movies, complete with posters, genres, overviews, and trailers.

Add to Watchlist: Save any recommended movie to your watchlist with a single click.

Watch Trailers: Preview recommended movies before watching them using embedded YouTube trailers.


🚀 Tech Stack
Backend: Flask, SQLite, Gunicorn

Frontend: Jinja2, HTML/CSS

Data Processing: Pandas, NumPy

Machine Learning: Content-based filtering using cosine similarity

API Integration: TMDb (The Movie Database) for posters and trailer

📌 Note
⚠️ Dataset Limitation:
This system currently uses a fixed dataset of 5,000 movies. As a result:

Recommendations are only available for movies present in this dataset.

Movie matching is based on the original movie title (e.g., original_title field from TMDb), so input must match exactly.

✅ Examples of supported movie titles include:
Avengers: Age of Ultron, Avatar, Titanic, Superman Returns, Pirates of the Caribbean: At World's End, John Carter, and many more.

If the title you enter is not found (due to being outside the dataset or misspelled), you’ll receive a "Movie not found" message.

