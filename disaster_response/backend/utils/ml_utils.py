# backend/utils/ml_utils.py
import joblib
import logging

# Load ML models
try:
    vectorizer = joblib.load("tfidf_vectorizer.pkl")
    model = joblib.load("disaster_model.pkl")
    label_encoder = joblib.load("label_encoder.pkl")
except Exception as e:
    logging.error(f"Error loading ML models: {str(e)}")
    raise e

def predict_disaster_category(message):
    """
    Predict the disaster category for a given message.
    """
    try:
        # Transform the message using the TF-IDF vectorizer
        vectorized_message = vectorizer.transform([message])
        
        # Predict the category
        predicted_class = model.predict(vectorized_message)[0]
        confidence = model.predict_proba(vectorized_message).max()
        
        # Decode the predicted class
        category_name = label_encoder.inverse_transform([predicted_class])[0]
        
        return category_name, confidence
    except Exception as e:
        logging.error(f"Prediction error: {str(e)}")
        return None, None