const contentData = {
    aboutSections: [
        "Hi, I’m Eldrex Delos Reyes Bula. I’ve always been the type of person who can be a little crazy and kind of mindless at times. Even when I’m quiet, my thoughts don’t really stop. I spend time wondering how things actually work, not just what’s visible, but what’s happening underneath. When I notice something that could make someone’s day lighter or clearer, I tend to follow it without needing a reason.",

        "I’m not someone who looks for attention. I think value comes from being thoughtful, listening well, and noticing things others might miss. I pay close attention to quiet details, like how someone reacts or what helps them feel at ease. These moments stick with me and often grow into ideas that feel worth building.",

        "Life hasn’t always been smooth. I’ve gone through times that felt uncertain or slow, but they taught me to stay grounded. I’ve learned not to rush growth or force answers. I’m still learning, still adjusting, and I’ve come to see that as part of the process. To me, progress means choosing to show up and keep going, even when things feel unclear.",

        "I don’t have everything figured out, and maybe I never will. But I believe in simple things done with care. I want to create work that feels honest, thoughtful, and useful in real ways. It doesn’t need to be loud. If it helps someone quietly, that’s more than enough for me. That’s the kind of path I want to follow."
    ],

    quotes: [{
            text: "Still Be the Blue",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "Crazy? Maybe. But I'd rather learn passionately than memorize mindlessly.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "The more we think, the more risks we understand, but sometimes we're quick to regret instead of embracing them.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "An old book might look like trash, yet it has the power to change lives, even if people can't see its worth at first glance.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "Sometimes, it's people themselves who make things seem impossible.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "Sometimes, it's curiosity that takes you to the place where you were meant to be.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "I serve people not a company",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "Numbers may define you, but it's your will to give them meaning.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "A man who can do what he wants, does what he wants.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "We lose not because we have little, but because we expect nothing more.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "Create what others can't see—because they won't know they needed it until it's here.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "Your limits aren't real if you're the one writing the rules.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "I never asked for attention. I just made things impossible to ignore.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "I didn't say it. I didn't do it. But that doesn't mean I didn't mean it with all of me.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "To own your information is not a feature—it is a right that should never be questioned.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "Change is our only goal, and that's why we're here to create a new story and become part of history.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "To exist is to question; to question is to live. And if all else is illusion, let my curiosity be real.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "If life is a labyrinth of illusions, then perhaps my purpose is not to escape, but to wander. To question without answer, to search without end—this may be the only truth we ever know.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "I'm in love—not with you, but with the essence of who you are.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "The strongest people are not those who show strength in front of us, but those who fight battles we know nothing about.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "The cost of convenience should never be the loss of control.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "A mother's gift isn't measured by how it looks, but by the love that came with it.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "A seed doesn't ask for perfect soil, nor does it wait for the perfect rain. It simply grows where it's planted, reaching for light with whatever it can find.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "If you can question everything, you can understand anything.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "A child's heart remembers the warmth of home, even when life keeps them far away.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "Hoping to be enough, just as I am",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "Fly again, My blue",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "Time moves so slow, yet I blink, and everything is gone.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "I thought I wanted freedom, but now I just want one more yesterday.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "A road without signs is only a problem if you believe you're going somewhere.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "A recipe followed perfectly still tastes different in someone else's hands.",
            author: "Eldrex Delos Reyes Bula"
        },
        {
            text: "We've waited for this day, but now we're wishing for one more.",
            author: "Eldrex Delos Reyes Bula"
        }
    ]
};

function createQuoteElement(quote, index) {
    const quoteElement = document.createElement('div');
    quoteElement.className = 'quote';
    quoteElement.dataset.quoteId = index;
    quoteElement.innerHTML = `
        "${quote.text}"
        <span class="quote-author">— ${quote.author}</span>
    `;
    quoteElement.style.animation = `slideUpFadeIn 0.6s ${1.8 + (index * 0.2)}s forwards`;
    return quoteElement;
}

function displayQuotes() {
    const quotesContainer = document.querySelector('.quotes-container');
    if (!quotesContainer) return;

    quotesContainer.innerHTML = '';
    contentData.quotes.forEach((quote, index) => {
        quotesContainer.appendChild(createQuoteElement(quote, index));
    });
}

function loadContent() {
    const aboutContentElements = [
        document.getElementById('aboutContent1'),
        document.getElementById('aboutContent2'),
        document.getElementById('aboutContent3'),
        document.getElementById('aboutContent4')
    ];

    aboutContentElements.forEach((el, index) => {
        if (el && contentData.aboutSections[index]) {
            el.textContent = contentData.aboutSections[index];
        }
    });

    displayQuotes();
}

function initReadMore() {
    const readMoreBtn = document.querySelector('.read-more-btn');
    const hiddenContent = document.querySelector('.hidden-content');

    if (!readMoreBtn || !hiddenContent) return;

    const toggleContent = (isExpanded) => {
        if (isExpanded) {
            hiddenContent.classList.remove('active');
            readMoreBtn.innerHTML = `
                <span>Read More</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            `;
            readMoreBtn.setAttribute('aria-expanded', 'false');
        } else {
            hiddenContent.classList.add('active');
            readMoreBtn.innerHTML = `
                <span>Read Less</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            `;
            readMoreBtn.setAttribute('aria-expanded', 'true');

            setTimeout(() => {
                readMoreBtn.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 300);
        }
    };

    readMoreBtn.addEventListener('click', () => {
        toggleContent(hiddenContent.classList.contains('active'));
    });

    readMoreBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleContent(hiddenContent.classList.contains('active'));
        }
    });
}

function init() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    loadContent();
    initReadMore();

    setTimeout(() => {
        const loadingContainer = document.querySelector('.loading-container');
        if (loadingContainer) loadingContainer.classList.add('hidden');
    }, 1500);

    window.addEventListener('beforeunload', () => {
        if (document.body) {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';
        }
    });
}

document.addEventListener('DOMContentLoaded', init);