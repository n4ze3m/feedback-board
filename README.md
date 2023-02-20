# Feedback Board

An open source tool that allows you to gather feedback from your users or customers, prioritize the most important feedback, and keep your team organized and informed. With features like email notifications, unlimited boards, upvotes, and comments, this tool is designed to make it easy to collect and manage feedback in a collaborative and efficient way.


## Features
- Email Notifications: Receive updates about feedback you have submitted or voted on.
- Unlimited Boards: Create and manage multiple feedback boards for different projects or departments.
- Upvotes and Comments: Interact with feedback and express your opinions.
- AI powered spam detection: CoHere NLP is used to detect spam and offensive content.


## Self-hosting

### Prerequisites

- [Node.js](https://nodejs.org/en/)(v14.15.0 or higher)
- [Supabase](https://supabase.io/) 
- [Courier](https://www.courier.com/) 
- [CoHere](https://www.cohere.ai/)

### Installation

1. Clone the repository

```bash

git clone https://github.com/n4ze3m/feedback-board.git

```

2. Install dependencies

```bash

cd feedback-board

npm install

```

3. Create a Supabase project and a new database

4. Create a new table in the database and name it `feedback` with the following columns:

```bash

npx prisma db push

```

5. Execute the query from [SUPABASE.sql](SUPABASE.sql) in the SQL editor of your Supabase project

6. Copy the `.env.example` file and rename it to `.env` and fill in the required values from your Supabase project

7. On your Courier project, create a template with the following variables:

- {subject}
- {message}
- {btnText}
- {btnLink}

8. Copy the template ID and API key from your Courier project and add them to the `.env` file


9 (optional). If you want to use CoHere NLP to detect spam, create an account and add the API key to the `.env` file

10. Start the development server

```bash

npm run dev

```

10. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Contributing

We welcome contributions from the community! If you find a bug or have a suggestion for a new feature, please open an [issue](/issues). If you would like to contribute code, please submit a [pull request](/pulls).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.