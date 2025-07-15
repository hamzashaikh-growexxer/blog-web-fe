# Angular Blog Web App

This is a simple blog web application built with **Angular 10.2.3** and powered by a **Laravel API backend**. It demonstrates full **CRUD operations** with features such as form handling, image upload, and API integration.

---

## 🚀 Features

- Fetch blog list using Laravel API
- Display blog data using Bootstrap cards
- Create a blog with multiple image uploads
- Update blog data and upload new images
- Delete a blog post
- Delete individual images from a blog post
- Reactive form validation and error handling
- Modular code with Angular best practices

---

## 🧰 Technologies Used

| Frontend            | Description                       |
| ------------------- | --------------------------------- |
| Angular 10.2.3      | Frontend framework                |
| Bootstrap 5         | UI styling and layout             |
| HttpClientModule    | For API communication             |
| ReactiveFormsModule | For building and validating forms |

| Backend               | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| Laravel               | RESTful API for blogs and image handling                      |
| MySQL                 | Database for storing blog content and images                  |
| Laravel Storage       | Stores uploaded images via `storage/app/public/uploads/blogs` |
| Laravel Form Requests | Request validation with custom rules                          |

---

## 📦 Installation

### Prerequisites

- Node.js & npm
- Angular
- Laravel API backend running at `http://localhost:8000`

### Clone the project

```bash
git clone https://github.com/hamzashaikh-growexxer/blog-web-fe
cd AngularWeb
npm install
```

### Development Server

```bash
ng serve
http://localhost:4200

```
