---
layout: default
title: "Dodaj klub lub wydarzenie"
description: "Zgłoś swój klub gier planszowych lub wydarzenie do Board Game Clubs. Nasz bezpłatny katalog prowadzony przez społeczność pomaga ludziom znaleźć kluby i wydarzenia gier planszowych w pobliżu, na całym świecie."
permalink: /pl/contribute/
---

<div class="content-page" markdown="1">

# Dodaj klub lub wydarzenie

Board Game Clubs jest prowadzony przez społeczność i hostowany na GitHubie. Każdy może dodać klub lub wydarzenie albo zaktualizować istniejący wpis.

## Zgłoś przez nasz formularz

Najprostszym sposobem dodania klubu jest formularz na GitHubie. Nie potrzeba wiedzy technicznej, wystarczy wypełnić dane, resztą zajmiemy się my.

<div class="contribute-actions">
  <a href="https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=add-club.yml" class="contribute-btn contribute-btn--primary">+ Dodaj klub</a>
  <a href="https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=edit-club.yml" class="contribute-btn contribute-btn--secondary">Edytuj klub</a>
  <a href="https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=add-event.yml" class="contribute-btn contribute-btn--secondary">Dodaj wydarzenie</a>
</div>

## Wolisz pull request?

Jeśli czujesz się dobrze z GitHubem, możesz dodać klub bezpośrednio. Rozwiń sekcję, aby zobaczyć instrukcję krok po kroku.

<details class="reveal" markdown="1">
<summary>Dodawanie klubu</summary>

### 1. Utwórz nowy plik

[Utwórz nowy plik](https://github.com/BoardGameClubs/BoardGameClubs/new/main/_clubs) w folderze `_clubs/<kraj>/` na GitHubie, gdzie `<kraj>` to kod ISO 3166-1 alpha-2 małymi literami (zgodny z jednym z istniejących folderów w `_clubs/`). Nazwij plik według schematu `nazwa-twojego-klubu.md` (małe litery, myślniki zamiast spacji). Dla nazw ze znakami diakrytycznymi użyj wariantów ASCII: `ą→a`, `ć→c`, `ę→e`, `ł→l`, `ń→n`, `ó→o`, `ś→s`, `ż→z`, `ź→z` (np. `klub-gier-krakow.md`).

### 2. Skopiuj szablon

Wklej poniższe do nowego pliku i uzupełnij dane. Ustaw `country` zgodnie z folderem.

```yaml
---
country: "PL"          # ISO 3166-1 alpha-2, wielkimi literami, zgodny z folderem
name: "Nazwa Twojego klubu"
type: ["Board Games"]
days: ["Thursday"]
time: "19:00 - 22:00"
frequency: "Weekly"
location:
  name: "Miejsce"
  address: "Pełny adres, kod pocztowy, miasto"
  lat: 52.2297
  lng: 21.0122
cost: "Free"
age_restriction: ""
image: ""
website: ""
meetup: ""
facebook: ""
discord: ""
bgg: ""
description: >-
  Krótki opis klubu. W co gracie?
  Czy nowi są mile widziani? Inne przydatne informacje.
---
```

Nie ustawiaj `permalink`. Strona klubu jest generowana automatycznie pod `/clubs/<nazwa-pliku>/`, z kopią pod każdym prefiksem języka (`/pl/clubs/...`, `/de/clubs/...` itd.).

### 3. Wypełnij pola

| Pole | Opis |
|------|------|
| `country` | Kod ISO 3166-1 alpha-2, wielkimi literami, zgodny z folderem |
| `name` | Pełna nazwa klubu |
| `type` | Tablica typów, np. `["Board Games"]`. Opcje: "Board Games", "RPG", "Wargames", "TCG", "BOTC" |
| `days` | Dni spotkań (po angielsku), np. `["Thursday"]` lub `["Monday", "Friday"]` |
| `time` | Godzina spotkania, np. "19:00 - 22:00" |
| `frequency` | "Weekly", "Fortnightly", "Monthly" lub "Ad-hoc" |
| `location` | Miejsce, pełny adres z kodem pocztowym, współrzędne |
| `cost` | "Free" lub kwota w lokalnej walucie, np. "€3", "£2", "CHF 5", "kr 20", "zł 10", "€5 (pierwsze spotkanie za darmo)" |
| `age_restriction` | Ograniczenie wiekowe, np. "18+". Zostaw puste, jeśli brak |
| `image` | URL lub nazwa pliku w `assets/images/clubs/` |
| `website` | Link do strony klubu |
| `meetup` | Link do grupy na Meetup |
| `facebook` | Link do strony lub grupy na Facebooku |
| `discord` | Link zapraszający na Discorda |
| `bgg` | Link do gildii lub grupy na BoardGameGeek |
| `description` | Tekst dowolny. Obsługiwany jest prosty Markdown: puste linie oddzielają akapity, linie zaczynające się od `-` stają się listami. Zobacz przykłady poniżej. |

### Formatowanie opisu

Pole `description` jest renderowane jako Markdown, więc możesz używać akapitów i list. Pamiętaj, by zachować dwie spacje wcięcia w block scalar YAML, inaczej Jekyll będzie protestował.

```yaml
description: |
  Jesteśmy otwartą grupą i spotykamy się w centrum Warszawy.
  Nowi są zawsze mile widziani, tłumaczymy zasady.

  Typowy wieczór:

  - Średni eurogame na początek
  - Później lżejsze gry karciane lub partygame'y
  - Sporo przerw i czasu na pogaduszki

```

Zapis `>-` z szablonu łączy linie w jeden akapit, dobry do krótkiego opisu. Przełącz na `|` (jak wyżej), jeśli chcesz zachować akapity i listy.

### 4. Znajdź współrzędne

Jak znaleźć szerokość i długość geograficzną miejsca:

1. Otwórz [OpenStreetMap](https://www.openstreetmap.org)
2. Wyszukaj adres
3. Kliknij prawym przyciskiem na mapę → „Pokaż adres"
4. Współrzędne pojawią się w adresie URL (lat i lng)

### 5. Dodaj logo

Możesz dodać logo lub obraz dla swojego klubu:

1. Wgraj obraz do `assets/images/clubs/` w repozytorium (PNG lub JPG, najlepiej kwadrat i poniżej 200 KB)
2. W pliku klubu ustaw pole `image` na nazwę pliku, np. `image: "logo-twojego-klubu.png"`

Alternatywnie możesz użyć bezpośredniego URL do obrazu hostowanego gdzie indziej, np. `image: "https://example.com/logo.png"`.

### 6. Wyślij pull request

Zatwierdź swój plik i [otwórz pull request](https://github.com/BoardGameClubs/BoardGameClubs/pulls). Sprawdzimy go i scalimy.

</details>

## Nie ma Twojego kraju?

Menu krajów w nagłówku strony pokazuje wszystkie kraje, które obecnie obsługujemy. Jeśli Twój klub jest gdzie indziej, [otwórz issue](https://github.com/BoardGameClubs/BoardGameClubs/issues/new). Dodanie nowego kraju to drobna zmiana i robimy to z chęcią.

## Aktualizacja istniejącego wpisu

Znajdź plik klubu w [folderze `_clubs/` na GitHubie](https://github.com/BoardGameClubs/BoardGameClubs/tree/main/_clubs), wprowadź zmiany i wyślij pull request. Albo po prostu **[otwórz prośbę o zmianę](https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=edit-club.yml)**, a zaktualizujemy go za Ciebie. W przypadku wydarzeń [otwórz prośbę o zmianę](https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=edit-event.yml) lub edytuj plik w `_events/`.

Wpisy są publikowane na licencji [CC BY 4.0]({{ "/pl/licence/" | relative_url }}).

</div>
