# TemP'Up

## Description

TemP'Up is a dynamic project and task management application designed to simplify project tracking and enhance productivity. This solution is ideal for individuals, freelancers, and teams looking to efficiently manage their daily tasks, track project progress, and maintain client information.

## Key Features

- **Project Management:** Easily create, manage, and track multiple projects.
- **Task Assignment:** Assign tasks to team members with deadlines and descriptions.
- **Client Management:** Keep a comprehensive record of client details associated with projects and tasks.
- **Time Tracking:** Monitor and log time spent on individual tasks and projects.
- **User-Friendly Interface:** A clean and intuitive user interface for streamlined task management.

## Installation

### Prerequisites

- Node.js
- MySQL
- npm (Node Package Manager)

### Setting Up

1. **Clone the Repository**

   ```bash
   git clone https://github.com/mxttttt/task_hopopup.git
   cd task_hopopup
   ```

2. **Install Dependencies**

   Navigate to both the server and client directories and install the necessary dependencies:

   ```bash
   # Server dependencies
   cd server
   npm install

   # Client dependencies
   cd ../client
   npm install
   ```

3. **Database Setup**

   Create a MySQL database named `task_hopopup` and import the provided SQL file to set up the schema.

4. **Environment Configuration**

   Set up the `.env` files in the server and client directories with the appropriate environment variables (e.g., database credentials, API endpoints).

5. **Start the Server and Client**

   ```bash
   # Start the server
   npm start

   # In a new terminal, start the client
   cd ../client
   npm start
   ```

   The application should now be running on `localhost`.

## Usage

After installation, you can access the TemP'Up interface through your web browser. Create projects, assign tasks, and manage your workflow efficiently.

## Contributing

Contributions to TemP'Up are welcome. To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -am 'Add a feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

For any questions or suggestions, please reach out through the GitHub repository's issues section or directly to the maintainer.

