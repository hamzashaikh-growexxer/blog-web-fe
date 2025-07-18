import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.scss'],
})
export class BlogFormComponent implements OnInit {
  blogForm: FormGroup;
  selectedFiles: File[] = [];
  existingImages: any[] = [];
  storageUrl = environment.storageUrl;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.blogForm = this.fb.group({
      id: [''],
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(150),
          Validators.pattern(/^[a-zA-Z0-9\s.,'"!?()-]+$/),
        ],
      ],
      content: [
        '',
        [
          Validators.required,
          Validators.maxLength(5000),
          Validators.pattern(/^[a-zA-Z0-9\s.,'"!?()-]+$/),
        ],
      ],
      image: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogService.getBlog(+id).subscribe((res) => {
        const blog = res.data;
        this.blogForm.patchValue(blog);
        this.existingImages = blog.images;
      });
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      const files = Array.from(input.files).filter((file) =>
        validTypes.includes(file.type)
      );
      this.selectedFiles = files;
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
    const isUpdate = !!blogId;

    const request = isUpdate
      ? this.blogService.updateBlog(blogId, formData)
      : this.blogService.createBlog(formData);

    request.subscribe({
      next: () => {
        const message = isUpdate
          ? 'Blog updated successfully!'
          : 'Blog created successfully!';
        this.toastr.success(message);
        this.router.navigate(['/blog']);
      },
      error: (error) => {
        if (error.error?.errors) {
          const validationErrors = error.error.errors;

          const allMessages = Object.keys(validationErrors)
            .reduce((acc: string[], field) => {
              return acc.concat(validationErrors[field]);
            }, [])
            .join('\n');
          this.toastr.error(allMessages, 'Validation Error');
        } else {
          const message =
            error.error?.message || 'An error occurred. Please try again.';
          this.toastr.error(message, `Error ${error.status}`);
        }
      },
    });
  }

  deleteImage(imageId: number): void {
    if (confirm('Are you sure you want to delete this image?')) {
      this.blogService.deleteImage(imageId).subscribe(() => {
        this.existingImages = this.existingImages.filter(
          (img) => img.id !== imageId
        );
        this.toastr.success('Image deleted successfully!', 'Success');
      });
    }
  }
}
