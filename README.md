# Rx Reminder API

*accurate as of v1.1.1*

-----
## Data Structure

### User

| Name              | Type        | Example                                                        |
| ----------------- | ----------- | -------------------------------------------------------------- |
| `id`              | uuid        | `48894bb8-382d-42de-ac7f-0b599ec10e0e`                         |
| `username`        | string      | `testuser`                                                     |
| `passwdHash`      | bcrypt hash | `$2a$10$WC6p./NE981EkqP1yM3eu.MJ0OjN.Yhzq44zCdt6lyStgzRQNP1tm` |
| `apiKey`          | string      | `HS5qBhaAwCNBUdGKhnLoa0AJuZfXNG06O2ZM7vWM76+2F4yyko2=`         |
| `email`           | string      | `email@example.com`                                            |
| `firstName`       | string      | `First`                                                        |
| `lastName`        | string      | `Last`                                                         |
| `linkedRxs`       | uuid[]      | `["0001","0002"]`                                              |
| `linkedReminders` | uuid[]      | `["1001", "1002"]`                                             |

### Scrips

| Name           | Type     | Example                                |
| -------------- | -------- | -------------------------------------- |
| `id`           | uuid     | `2a2f7c4c-7f90-4075-9cab-27f41ac673f7` |
| `rxNum`        | string   | `600247`                               |
| `name`         | string   | `medication`                           |
| `strength`     | string   | `150 mg`                               |
| `stock`        | number   | `30.00`                                |
| `instructions` | string   | `take one by mouth as needed`          |
| `warnings`     | string[] | `["dizzy", "heavy", "withFood"]`       |

### Reminders

| Name       | Type          | Example                                |
| ---------- | ------------- | -------------------------------------- |
| `id`       | uuid          | `6e221a98-a42e-4d8f-928b-4fbecc3c4ca5` |
| `userId`   | uuid          | `48894bb8-382d-42de-ac7f-0b599ec10e0e` |
| `interval` | string (cron) | `0 10 1-31/2 * *`                      |
| `nextFire` | DateTime      | `1970-01-01T00:00:00.000`              |
| `rxs`      | uuid[]        | `["0001"]`                             |
| `doses`    | JSON          | `{"0001": 1}`                          |

-----
*Copyright 2021 Brooke Morrison*

*Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:*

*The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.*

*THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*