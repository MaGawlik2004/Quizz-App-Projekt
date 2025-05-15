# Quizz App Projekt

Interaktywna aplikacja quizowa stworzona jako projekt zaliczeniowy łącząca wymagania z trzech przedmiotów:

- Bazy Danych
- Bezpieczeństwo Aplikacji Webowych
- Technologie Chmurowe

## 🎯 Cel projektu

Celem projektu jest stowrzenie aplikacji quizowej umożliwającej tworzenie, rozwiązywanie i ocenianie quizów z podziałem na role użytkowników, System implementuje:

- Architektura miekroserwisowa
- Uwierzytelnianie i autoryzacja z użyciem OAuth2 / Keycloak
- Przechowywanie danych w bazie PostgreSQL
- Konteneryzacja z Dockerem i wdrożenie na Kubernetesie

## 🧱 Technologie użyte w projekcie

- Frontend: Next.js
- Backend: Express.js
- Baza danych: PostgreSQL
- Uwierzetelnianie: Keycloak (OAuth2)
- Chmurowe uruchomienie: Docker, Docker Compose, Kubernetes

## 📦 Struktura katalogów

quizz-app-projekt/
|------ frontend/ # Aplikacja Next.js
|------ quizz-app-api/ # Bakcend z REST API
|------ keycloak/ # Konfiguracja Keycloak
|------ README.md

## 🧪 Funkcjonalności

## 📋 Status i TODO

- [ ] Backend podstawowy
- [ ] Frontend SPA
- [ ] Docker Compose
- [ ] Keycloak (w trakcie konfiguracji)
- [ ] Kubernetes manifesty
- [ ] Monitoring i CI/CD
