import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = environment.apiUrl; 
  private placeholderPath = 'assets/placeholder.png';

  constructor() { }

  /**
   * Gets the proper image URL for employee photos
   * @param photoPath The photo path or filename from the database
   * @returns A complete URL to the image
   */
  getEmployeePhotoUrl(photoPath: string | undefined): string {
    if (!photoPath) {
      return this.placeholderPath;
    }

    // If it's a base64 image, return it directly
    if (photoPath.startsWith('data:image')) {
        return photoPath;
    }
    // Check if it's already a full URL or base64 data
    if (photoPath.startsWith('http') || photoPath.startsWith('data:image')) {
      return photoPath;
    }

    // Check if it's just a filename (like "alice.jpg" or "alice_1234567890.jpg")
    if (!photoPath.includes('/')) {
      return `${this.apiUrl}/uploads/${photoPath}`;
    }

    // Try to handle various path scenarios
    if (photoPath.startsWith('/uploads/')) {
      return `${this.apiUrl}${photoPath}`;
    }
    
    // Otherwise return the path as is, assuming it's relative to assets
    console.log('Falling back to placeholder for:', photoPath);
    return photoPath;
  }
}