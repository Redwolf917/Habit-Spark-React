document.addEventListener('DOMContentLoaded', () => {
    const finishButton = document.getElementById('finish-button');

    finishButton.addEventListener('click', (event) => {
        event.preventDefault();

        // Retrieve the habit title from localStorage
        const habitTitle = localStorage.getItem('habitTitle');
        if (!habitTitle) {
            console.error('Habit title not found in localStorage');
            return;
        }

        // Collect user input
        const workoutEntry = document.querySelector('.form-group');
        const name = workoutEntry.querySelector('select').value;
        const unit = workoutEntry.querySelectorAll('select')[1].value;
        const value = workoutEntry.querySelector('input').value;
        const cardioWorkout = { name, unit, value };

        // Store the data in localStorage
        localStorage.setItem('cardioWorkout', JSON.stringify(cardioWorkout));

        // Generate the schedule
        const schedule = generateSchedule();

        // Use the habit title as the schedule name
        const scheduleName = habitTitle;

        // Store the schedule in localStorage
        storeSchedule(schedule, scheduleName);

        // Clear the stored workouts
        localStorage.removeItem('upperBodyWorkouts');
        localStorage.removeItem('coreWorkouts');
        localStorage.removeItem('lowerBodyWorkouts');
        localStorage.removeItem('cardioWorkout');

        // Redirect to the home page after finishing
        window.location.href = '../index.html';
    });

    function generateSchedule() {
        const upperBodyWorkouts = JSON.parse(localStorage.getItem('upperBodyWorkouts')) || [];
        const coreWorkouts = JSON.parse(localStorage.getItem('coreWorkouts')) || [];
        const lowerBodyWorkouts = JSON.parse(localStorage.getItem('lowerBodyWorkouts')) || [];
        const cardioWorkout = JSON.parse(localStorage.getItem('cardioWorkout')) || {};

        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        let schedule = "Habit Spark 3-Week Workout Schedule\n\n";

        for (let week = 1; week <= 3; week++) {
            schedule += `Week ${week}:\n`;
            schedule += `------------------------------------\n`;
            schedule += `Remember to set the weight to be challenging but comfortable for each exercise.\n\n`;
            schedule += `------------------------------------\n`;

            daysOfWeek.forEach((day, index) => {
                schedule += `${day}:\n`;

                if (day === 'Sunday') {
                    schedule += `  - Cardio: ${cardioWorkout.name} - ${cardioWorkout.value} ${cardioWorkout.unit}\n`;
                } else if (index === 0 || index === 3) { // Upper Body days
                    upperBodyWorkouts.forEach(workout => {
                        schedule += `  - Upper Body: ${workout.name}: 3 sets of ${workout.value} ${workout.unit}\n`;
                    });
                } else if (index === 1 || index === 4) { // Lower Body days
                    lowerBodyWorkouts.forEach(workout => {
                        schedule += `  - Lower Body: ${workout.name}: 3 sets of ${workout.value} ${workout.unit}\n`;
                    });
                } else { // Core days
                    coreWorkouts.forEach(workout => {
                        schedule += `  - Core: ${workout.name}: 3 sets of ${workout.value} ${workout.unit}\n`;
                    });
                }

                schedule += `\n`;
            });

            schedule += `------------------------------------\n\n`;
        }

        return schedule;
    }

    function storeSchedule(schedule, scheduleName) {
        const schedules = JSON.parse(localStorage.getItem('generatedSchedules')) || [];
        schedules.push({ name: scheduleName, content: schedule });
        localStorage.setItem('generatedSchedules', JSON.stringify(schedules));
    }
});
