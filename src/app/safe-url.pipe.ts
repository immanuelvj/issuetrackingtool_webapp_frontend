import { Pipe } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Pipe({name: 'safeHtml'})
export class SafePipe {
  constructor(private sanitizer:DomSanitizer){}

  transform(html) {
   html = html.replace(/\s/g,"+")
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }
}