# Meeting Minutes Generator

## Overview

This project aims to automate the generation of meeting minutes, including live transcriptions, using Flask and ReactJS. The system sends an email notification to the designated recipient (in this case, 'mom') once the meeting is finished.

## Features

- **Live Transcriptions**: Utilizing speech-to-text capabilities, the system transcribes meeting conversations in real-time.
- **Email Notification**: Automatically sends an email notification to the specified recipient (e.g., 'mom') upon meeting completion.
- **Flask Backend**: Implements the server-side logic using Flask, a lightweight WSGI web application framework.
- **ReactJS Frontend**: Employs ReactJS for the client-side interface, offering dynamic and responsive user interactions.
- **Git Integration**: Maintains version control using Git, facilitating collaborative development and tracking project changes.

## Setup Instructions

1. **Clone the Repository**: Begin by cloning this Git repository to your local machine.

```bash
git clone <repository_url>
```

2. **Install Dependencies**: Navigate to the project directory and install the required dependencies for both the Flask backend and ReactJS frontend.

```bash
cd EasyMinutes
npm install # For installing ReactJS dependencies
pip install -r requirements.txt # For installing Flask dependencies
```

3. **Configuration**:
    - Update `config.py` with the appropriate email credentials and configuration settings.
    - Ensure that Flask's SMTP server settings are correctly configured in `config.py`.

4. **Run the Application**:
    - Start the Flask backend server:

```bash
python app.py
```

   - Start the ReactJS frontend:

```bash
npm start
```

5. **Access the Application**: Open your web browser and navigate to `http://localhost:3000` to access the application.

## Usage

1. **Start a Meeting**: Begin a new meeting session by clicking the "Start Meeting" button on the interface.
2. **Live Transcriptions**: As the meeting progresses, the system transcribes the conversation in real-time and displays it on the interface.
3. **End Meeting**: Upon completion of the meeting, click the "End Meeting" button to finalize the session.
4. **Email Notification**: An email notification is automatically sent to the designated recipient (e.g., 'mom') with the meeting minutes.

## Contributing

Contributions to this project are welcome! To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/new-feature`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
