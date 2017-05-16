import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'hero-search',
    templateUrl: './hero-search.component.html',
    styleUrls: ['./hero-search.component.css'],
    providers: [HeroSearchService]
})
export class HeroSearchComponent implements OnInit {
    heroes: Observable<Hero[]>;
    private searchTerms = new Subject<string>();
    constructor(private heroSearchService: HeroSearchService, private router: Router) {

    }
    ngOnInit(): void {
        this.heroes = this.searchTerms.debounceTime(300).distinctUntilChanged()
            .switchMap(term => term ? this.heroSearchService.search(term) : Observable.of<Hero[]>([])).catch(error => {
                console.log(error);
                return Observable.of<Hero[]>([]);
            });
    }

    search(term: string): void {
        console.log(term)
        this.searchTerms.next(term);
    }

    gotoDetail(hero: Hero): void {
        const link = ['/detail', hero.id];
        this.router.navigate(link);
    }
}
