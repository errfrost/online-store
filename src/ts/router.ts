import { Router } from './types/interface';
import { Home } from './view/Home';
import { Page404 } from './view/Page404';

function navigateTo(url: string) {
    history.pushState(null, '', url);
    router();
}

async function router() {
    const routes: Router[] = [
        { path: '/', view: Home },
        { path: '/404', view: Page404 },
    ];

    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            result: location.pathname === route.path,
        };
    });

    let match = potentialMatches.find((potentialMatch) => potentialMatch.result == true);

    if (!match) {
        match = {
            route: routes[1],
            result: true,
        };
    }

    const view = new match.route.view();

    (document.querySelector('.main') as HTMLElement).innerHTML = await view.getHtml();
    await view.mounted();
}

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        if ((<HTMLElement>e.target).matches('[data-link]')) {
            e.preventDefault();
            navigateTo((<HTMLAnchorElement>e.target).href);
        }
    });

    router();
});
