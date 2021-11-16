import { TestBed } from '@angular/core/testing';

import { PostService } from './post.service';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";
import {EMPTY} from "rxjs";

describe('PostService', () => {
  let service: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule]
    });
    service = TestBed.inject(PostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call createPost method', () => {

    const createPostMethod = spyOn(service, "createPost");

    service.createPost('some post', 1);

    expect(createPostMethod).toHaveBeenCalled();
  });
});
