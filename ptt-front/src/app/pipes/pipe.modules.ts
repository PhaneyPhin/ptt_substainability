import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { THDatePipe } from './th-date.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';


@NgModule({
    imports: [CommonModule],
    declarations: [THDatePipe, SafeHtmlPipe],
    exports: [THDatePipe, SafeHtmlPipe]
})

export class PipeModule { }