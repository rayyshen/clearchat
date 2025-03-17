# [🔎💬  ClearChat]

ClearChat is a messaging app designed to revolutionize digital communication by integrating real-time facial sentiment analysis into every chat. By capturing the sender’s genuine emotional response through advanced AI-driven sentiment analysis, each message carries authentic emotional context, reducing misunderstandings and enhancing empathy between users. In an era where digital conversations often obscure genuine emotions, ClearChat bridges the gap, fostering more transparent, meaningful, and human connections. 

Created at [Scrapyard NoVA](https://scrapyard.hackclub.com/nova)

## 📦 Install ClearChat locally

Use [git](https://git-scm.com/downloads) to install ClearChat.

```bash
git clone https://github.com/rayyshen/clearchat.git
```

## 💻 Run ClearChat locally

```bash
git clone https://github.com/rayyshen/clearchat.git
npm install
npm run dev
```
## 🤔 How it works
ClearChat transforms traditional messaging by embedding genuine emotions directly into every message. Users securely sign up and log in using Firebase Authentication, ensuring quick and reliable access. Real-time messages are stored with Firestore Database, guaranteeing immediate delivery and consistent availability among users.

As messages are created, ClearChat uses the [Gemini 2.0 Flash-Lite](https://developers.googleblog.com/en/gemini-2-family-expands/) model to perform real-time facial sentiment analysis via webcam, accurately capturing emotions such as happiness, sadness, surprise, frustration, etc. Built on Next.js and styled with Tailwind CSS, ClearChat offers a fast, intuitive, and visually appealing user interface, providing a seamless, authentic chat experience across all platforms.

## 💞 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Authors

- [@rayyshen](https://www.github.com/rayyshen)
- [@FelixTrask](https://github.com/FelixTrask)
- [@George-Taco](https://github.com/George-Taco)


## 🔑 License
[MIT](https://choosealicense.com/licenses/mit/)
