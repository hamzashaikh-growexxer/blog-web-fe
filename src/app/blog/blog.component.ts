import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  blogs: any[] = [];
  blogForm: FormGroup;
  existingImages: any[] = [];
  selectedFiles: File[] = [];

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.blogForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      content: ['', Validators.required],
      image: [''],
    });

    this.loadBlogs();
  }

  loadBlogs(): void {
    this.http.get<any>('http://localhost:8000/api/blogs').subscribe((res) => {
      this.blogs = res.data;
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const validImageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/jpg',
      ];

      const files = Array.from(input.files);
      const validFiles = files.filter((file) =>
        validImageTypes.includes(file.type)
      );

      if (validFiles.length !== files.length) {
        alert('Only image files (jpg, jpeg, png, gif, webp) are allowed.');
      }

      this.selectedFiles = validFiles;
    }
  }
  submitBlog(): void {
    if (this.blogForm.invalid) return;

    const formData = new FormData();
    formData.append('title', this.blogForm.value.title);
    formData.append('content', this.blogForm.value.content);

    for (let file of this.selectedFiles) {
      formData.append('images[]', file);
    }

    const blogId = this.blogForm.value.id;

    if (blogId) {
      this.http
        .post<any>(
          `http://localhost:8000/api/blogs/${blogId}?_method=PUT`,
          formData
        )
        .subscribe((response) => {
          alert('Blog updated successfully!');
          this.loadBlogs();
          this.selectedFiles = [];
          this.existingImages = [];
        });
    } else {
      this.http
        .post<any>('http://localhost:8000/api/blogs', formData)
        .subscribe((response) => {
          alert('Blog created successfully!');
          this.blogs.push(response.data);
          this.selectedFiles = [];
        });
    }
    this.blogForm.reset();
  }

  deleteBlog(id: number): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.http
        .delete(`http://localhost:8000/api/blogs/${id}`)
        .subscribe(() => {
          this.blogs = this.blogs.filter((blog) => blog.id !== id);
        });
    }
  }

  deleteImage(imageId: number): void {
    if (confirm('Are you sure you want to remove this image?')) {
      this.http
        .delete(`http://localhost:8000/api/blog-images/${imageId}`)
        .subscribe(() => {
          this.existingImages = this.existingImages.filter(
            (img) => img.id !== imageId
          );
        });
    }
  }

  editBlog(id: number): void {
    this.http
      .get<any>(`http://localhost:8000/api/blogs/${id}`)
      .subscribe((res) => {
        const blog = res.data;
        this.blogForm.patchValue({
          id: blog.id,
          title: blog.title,
          content: blog.content,
          image: '',
        });
        this.existingImages = blog.images;
      });
  }
}
