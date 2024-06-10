# 🚂 TrackTech Project

A project showcasing anomaly detection using React and JavaScript.

## 🤝 Team Members:

- [Moussa Marmouch](https://github.com/moussamarmouch)
- [Jarne Dirken](https://github.com/jarnedirken)
- [Dennis Raaijmakers](https://github.com/dennis-r)
- [Jonas Baelus](https://github.com/JonasBaelus)
- [Sam Van Den Bogerd](https://github.com/samvandenbogerd)
- [Lwam B. Teklay](https://github.com/LwamB)

## 📦 Technologies

- `React`
- `JavaScript`
- `CSS`
- `C#`
- `.NET`
- `PostgreSQL`
- `Websockets`
- `AWS`
- `Terraform`
- `GitLab CI/CD`
- `FastAPI`

## ✨ Features

Our anomaly display application includes:

- **View the anomaly page**: Displays all detected anomalies.
- **View the assets page**: Displays all detected assets.
- **View the statistics page**: Displays statistics of the anomalies.
- **Filter anomalies, assets, or statistics**: Filter by solved, flagged, date, type, etc.
- **View details of an anomaly or asset**: View detailed information by clicking on an anomaly or asset.
- **Add a reaction to an anomaly or asset**: Add a reaction in the text area.
- **Change the status of an anomaly or asset**: Change the status to solved or flagged.
- **Real-time updating**: Real-time updates of anomalies with instant map changes and toast messages.

## 🛤️ The Process

This final project for our bachelor's degree involved collaborating with a real client. Our team included three Application Development students, two Cyber Security students, and one AI student.

RideOnTrack, our client, had extensive video footage of trains in Belgium. The footage, filmed with a camera on top of the train, was overwhelming their storage. Our task was to develop an AI model to detect anomalies (e.g., tree branches on the track) and assets (e.g., traffic lights) from this footage. The model would send snapshots to our server, which we displayed in our front-end application.

We chose React for its fast load times and JavaScript suitability. For the backend, we used .NET and C#, aligning with the client’s familiarity with C++.

Each sub-team initially worked separately. As a CSS student, I focused on setting up the AWS environment, Terraform scripts, GitLab CI/CD pipelines, and FastAPI for data handling. We faced challenges due to limited access to services like AWS CloudMap but implemented effective workarounds.

By the third week, we integrated all components. The FastAPI was connected with the AI model to send detected anomalies to the S3 bucket and our database, updating the front-end in real-time. The project was completed with minor tweaks, achieving our goal.

## 📚 What I Learned

### 🧠 Brain:

- **Logical Thinking**
- **Problem Solving**

### ⌚ Time Management:

- **Using Scrum Board**: Trello helped us keep track of tasks and stay organized.

### 📓 New Knowledge:

- **FastAPI**: Learned to create a reliable API with Python.
- **AWS**: Gained experience in setting up cloud infrastructure.
- **Terraform**: Acquired advanced knowledge in creating AWS environments.

### 🎡 Security:

- **AWS Security**

### 📈 Overall Growth:

This project enhanced my understanding of teamwork, adaptability, and rapid learning.

## 💭 How Can It Be Improved?

- Enhance API security
- Implement additional features

## 🚦 Running the Project

To run the project locally, follow these steps:

1. Clone the repository to your local machine.
2. Run `npm install` or `yarn` in the project directory to install the required dependencies.
3. Run `npm run start` or `yarn start` to start the project.
4. Open [http://localhost:8000](http://localhost:8000) (or the address shown in your console) in your web browser to view the app.

## 🍿 Video

[Project Demonstration](https://www.youtube.com/watch?v=PX_gxbysHCE&t=3s)
