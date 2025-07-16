import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getBlogs() {
    return this.http.get<any>(`${this.baseUrl}/blogs`);
  }

  getBlog(id: number) {
    return this.http.get<any>(`${this.baseUrl}/blogs/${id}`);
  }

  createBlog(data: FormData) {
    return this.http.post<any>(`${this.baseUrl}/blogs`, data);
  }

  updateBlog(id: number, data: FormData) {
    return this.http.post<any>(`${this.baseUrl}/blogs/${id}?_method=PUT`, data);
  }

  deleteBlog(id: number) {
    return this.http.delete(`${this.baseUrl}/blogs/${id}`);
  }

  deleteImage(id: number) {
    return this.http.delete(`${this.baseUrl}/blog-images/${id}`);
  }
}
