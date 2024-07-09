import { Component, OnInit } from '@angular/core';
import { Help } from 'src/app/models/help';
import { PDFHelpDoc } from 'src/app/models/pdfHelpDoc';
import { HelpService } from 'src/app/services/help.service';
import { PDFHelpDocService } from 'src/app/services/pdf-help-doc.service';
import { TextToSpeechService } from 'src/app/services/text-to-speech.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/users';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FAQComponent implements OnInit {
  routeList: any[] = [];

  helpData: any[] = [];
  FAQ: Help | undefined;
  helpDescription: string = '';
  searchTerm: string = '';
  textToSpeak: string = '';

  Token: any;
  user!: User;
  pdfSrc?: string;

  constructor(private textToSpeechService: TextToSpeechService,
    private authService: AuthenticationService,
    public service: HelpService,
    private helpPdfService: PDFHelpDocService) {
  }

  ngOnInit(): void {
    this.GetFAQs();

    if (localStorage.getItem("Token")) {
      this.Token = JSON.parse(localStorage.getItem("Token")!)
    }

    this.authService.getUser(this.Token.id).subscribe(result => {
      this.user = result;
    });
  }

  GetFAQs() {
    this.service.getFAQs().subscribe((result: any[]) => {
      // stores help data in an array for displaying
      this.helpData = result;
    })
  }

  GetFAQ() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getFAQByName(this.searchTerm).subscribe((result: any[]) => {
        this.helpData = result;
      });
    }
    else {
      this.GetFAQs();
    }
  }

  expandHelp(help: Help) {
    this.FAQ = help;
    this.textToSpeak = this.FAQ.helpDescription;
  }
  

  getHelpPdf() {
    this.helpPdfService.getPDFHelpDocs().subscribe((result: any[]) => {
      if (Array.isArray(result)) {
        let id = '0';
        if (this.Token.role == "ADMIN") {
          id = '1';
        } else if (this.Token.role == "TECHNICIAN") {
          id = '2';
        } else if (this.Token.role == "INVENTORY_CLERK") {
          id = '3';
        } else if (this.Token.role == "CLIENT_USER" || this.Token.role == "CLIENT_ADMIN") {
          id = '999';
        }
  
        const pdfData = result.find(x => x.userType == id);
  
        if (pdfData?.pdfContent) {
          // Decode base64 content
          const byteArray = Uint8Array.from(atob(pdfData.pdfContent), c => c.charCodeAt(0));
          const blob = new Blob([byteArray], { type: 'application/pdf' });
  
          // Use FileSaver to prompt the user to download the file
          saveAs(blob, 'help_document.pdf');
        } else {
          console.error('PDF content is missing or invalid.');
        }
      } else {
        console.error('Result is not an array.');
      }
    });
  }
 

  base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  speak() {
    this.textToSpeechService.speak(this.textToSpeak);

    // doesnt work. refer to note in service
    // this.textToSpeechService.checkPlayback(this.textToSpeak);
  }

  stop() {
    this.textToSpeechService.stop();
  }
}
