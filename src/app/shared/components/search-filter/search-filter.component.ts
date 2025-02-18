import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-filter',
  template: `
    <mat-form-field appearance="outline" class="w-100">
      <mat-label>{{placeholder}}</mat-label>
      <input matInput [formControl]="searchControl" [placeholder]="placeholder">
      <button mat-icon-button matSuffix *ngIf="searchControl.value" (click)="clearSearch()">
        <mat-icon>close</mat-icon>
      </button>
      <mat-icon matSuffix>search</mat-icon>
    </mat-form-field>
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: 1rem;
    }
  `]
})
export class SearchFilterComponent {
  @Input() placeholder = 'Rechercher...';
  @Output() search = new EventEmitter<string>();

  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.search.emit(value || '');
      });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }
}