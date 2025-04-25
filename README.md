# raySpark

This is Ray Spark, a mini project produced as a demonstration of my ETL, data visualization, and javaScript knowledge. You may notice that the name is rather silly; it sounds like "Rays' Park" and looks misspelled. The name actually comes from "sparklines", a type of word-sized chart meant to provide glanceable data inline with text. Edward Tufte introduced me to the concept in his book "Beautiful Evidence" and provides one unique example in the baseball win-loss sparkline. Using tickmarks to show games and their relative position along an axis to denote wins and losses, a team's hotstreaks, droughts, and overall success across the entire 162 game season can be contextualized for readers.

After talking with Luke Fair about D3 for some time in my phone screen, I decided to try generating a large-format sparkline as the main visualization in this app. The idea was to cram the date, the score, the opponent, and the location indication inside each (fairly wide) tickmark and allow the user to hover over each tick to show a modal containing the highlight stats of that game's starting pitcher. A few issues arised during implementation:

1. If I wanted to handle spring training games, I needed to be able to represent a tie. Unfortunately, this graphic doesn't work well with ternary data.

2. This visualization doesn't look as good when the tickmarks are made wide. The compact, glanceable nature of the form is what makes it so powerful; needing to scroll to see the whole chart robs it of that powerful.

3. D3 wasn't behaving super well with all of the extra text I was shoving into the tick marks.

So I threw that idea into the trash and represented the games with squares instead, kind of like a typical calendar-based schedule. I figured I didn't have time to build calendar spacing and formatting into this project, so the game order is pegged to the first game of the regular season and flows left-to-right before starting a new line. Below the header bar is an animated drawer containing some cumulative team statistics, including the win-loss sparkline that inspired this project in the first place. Clicking ona square gives you the starting pitcher statistics for that game in a modal window.

I incorporated the Rays' city connect colors into the theme of the application to give the app some flair and built the application to run entirely within one page using Vue Single File Components. There's so much more I would have loved to do with this, like handling spring training and post-season games, letting the user choose the season they want to view, and building an actual calendar into the application. But I wanted to give you all an honest look at what I can make in about 2 hours, so I limited the scope of the project to only this year's regular season games.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
