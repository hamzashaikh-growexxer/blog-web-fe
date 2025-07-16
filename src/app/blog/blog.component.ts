import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blog.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  blogs: any[] = [];

  constructor(
    private blogService: BlogService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getBlogs().subscribe((res) => {
      this.blogs = res.data;
    });
  }
  deleteBlog(id: number): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.deleteBlog(id).subscribe(() => {
        this.blogs = this.blogs.filter((blog) => blog.id !== id);
        this.toastr.success('Blog deleted successfully!');
      });
    }
  }
}
