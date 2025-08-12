let userProfile = {};
        let selectedGoal = '';
        let selectedDiet = '';
        let weeklyPlan = [];
        let progressData = {
            startWeight: 0,
            currentWeight: 0,
            targetWeight: 0,
            daysTracked: 0,
            totalCaloriesConsumed: 0,
            totalCaloriesBurned: 0
        };

        const dietPlans = {
            'weight-loss': {
                vegetarian: {
                    dailyCalories: -500,
                    description: "Calorie deficit plan with nutrient-rich plant-based meals and dairy",
                    meals: {
                        breakfast: ["Oats with berries and almonds", "Greek yogurt with nuts", "Vegetable poha", "Quinoa breakfast bowl"],
                        lunch: ["Lentil salad with vegetables", "Quinoa and chickpea bowl", "Vegetable soup with whole grain bread", "Grilled paneer with salad"],
                        dinner: ["Grilled vegetables with tofu", "Lentil curry with brown rice", "Vegetable stir-fry", "Chickpea salad"],
                        snacks: ["Mixed nuts (10-15)", "Apple with peanut butter", "Carrot sticks with hummus", "Green tea"]
                    }
                },
                'non-vegetarian': {
                    dailyCalories: -500,
                    description: "Calorie deficit plan with lean proteins and balanced nutrition",
                    meals: {
                        breakfast: ["Egg white omelet with vegetables", "Grilled chicken with avocado", "Protein smoothie", "Boiled eggs with whole grain toast"],
                        lunch: ["Grilled chicken salad", "Fish with quinoa", "Turkey wrap with vegetables", "Chicken soup with vegetables"],
                        dinner: ["Grilled salmon with vegetables", "Chicken breast with sweet potato", "Fish curry with brown rice", "Lean beef with salad"],
                        snacks: ["Greek yogurt", "Handful of almonds", "Boiled egg", "Protein bar"]
                    }
                }
            },
            'weight-gain': {
                vegetarian: {
                    dailyCalories: 500,
                    description: "Calorie surplus plan with protein-rich plant-based meals for healthy weight gain",
                    meals: {
                        breakfast: ["Banana pancakes with nuts and milk", "Oatmeal with dried fruits and honey", "Avocado toast with seeds", "Protein smoothie with banana and yogurt"],
                        lunch: ["Chickpea curry with rice", "Paneer butter masala with naan", "Lentil dal with ghee and rice", "Quinoa bowl with nuts and cheese"],
                        dinner: ["Stuffed paratha with yogurt", "Vegetable biryani", "Paneer tikka with rice", "Mixed dal with bread"],
                        snacks: ["Nuts and dried fruits", "Milkshake", "Cheese sandwich", "Energy balls with dates"]
                    }
                },
                'non-vegetarian': {
                    dailyCalories: 500,
                    description: "Calorie surplus plan with high-protein meals for muscle building",
                    meals: {
                        breakfast: ["Scrambled eggs with cheese", "Chicken sausage with bread", "Protein pancakes", "Omelette with meat"],
                        lunch: ["Chicken biryani", "Fish curry with rice", "Mutton curry with bread", "Grilled chicken with quinoa"],
                        dinner: ["Beef steak with potatoes", "Chicken tikka with rice", "Fish fry with bread", "Lamb curry with rice"],
                        snacks: ["Protein shake", "Chicken sandwich", "Boiled eggs", "Tuna salad"]
                    }
                }
            },
            'maintenance': {
                vegetarian: {
                    dailyCalories: 0,
                    description: "Balanced plant-based meals with dairy to maintain current weight",
                    meals: {
                        breakfast: ["Whole grain cereal with milk", "Vegetable upma", "Oats with fruits", "Sprouted grain salad"],
                        lunch: ["Dal rice with vegetables", "Chapati with sabzi", "Vegetable pulao", "Quinoa salad"],
                        dinner: ["Light vegetable curry with rice", "Soup with bread", "Grilled vegetables with paneer", "Lentil soup"],
                        snacks: ["Fresh fruits", "Buttermilk", "Roasted seeds", "Herbal tea"]
                    }
                },
                'non-vegetarian': {
                    dailyCalories: 0,
                    description: "Balanced meals with lean proteins to maintain current weight",
                    meals: {
                        breakfast: ["Boiled eggs with toast", "Chicken porridge", "Fish with bread", "Egg sandwich"],
                        lunch: ["Chicken curry with rice", "Fish with vegetables", "Meat soup", "Grilled chicken salad"],
                        dinner: ["Light fish curry", "Chicken soup", "Grilled meat with salad", "Steamed fish"],
                        snacks: ["Yogurt", "Nuts", "Fresh fruits", "Green tea"]
                    }
                }
            }
        };

        function showSection(sectionId) {
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => section.classList.remove('active'));
            const navTabs = document.querySelectorAll('.nav-tab');
            navTabs.forEach(tab => tab.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            
            event.target.classList.add('active');
        }

        function calculateBMR() {
            const name = document.getElementById('name').value;
            const age = parseInt(document.getElementById('age').value);
            const gender = document.getElementById('gender').value;
            const height = parseInt(document.getElementById('height').value);
            const weight = parseInt(document.getElementById('weight').value);
            const activity = document.getElementById('activity').value;

            if (!name || !age || !gender || !height || !weight || !activity) {
                alert('Please fill in all fields!');
                return;
            }

            userProfile = { name, age, gender, height, weight, activity };

            let bmr;
            if (gender === 'male') {
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            } else {
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            }

            const activityMultipliers = {
                'sedentary': 1.2,
                'light': 1.375,
                'moderate': 1.55,
                'active': 1.725,
                'very-active': 1.9
            };

            const tdee = bmr * activityMultipliers[activity];

            const bmi = weight / ((height / 100) ** 2);
            
            let category;
            if (bmi < 18.5) category = 'Underweight';
            else if (bmi < 25) category = 'Normal';
            else if (bmi < 30) category = 'Overweight';
            else category = 'Obese';

            document.getElementById('bmi-value').textContent = bmi.toFixed(1);
            document.getElementById('bmr-value').textContent = Math.round(bmr);
            document.getElementById('tdee-value').textContent = Math.round(tdee);
            document.getElementById('category').textContent = category;
            document.getElementById('bmr-results').style.display = 'block';

            userProfile.bmr = bmr;
            userProfile.tdee = tdee;
            userProfile.bmi = bmi;
            userProfile.category = category;

            progressData.startWeight = weight;
            progressData.currentWeight = weight;

            document.getElementById('bmr-results').style.animation = 'fadeIn 0.8s ease';
        }

        function selectGoal(goal) {
            selectedGoal = goal;
            
            document.querySelectorAll('#diet-plan .diet-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            event.target.classList.add('selected');
            
            updateDietRecommendations();
        }

        function selectDiet(diet) {
            selectedDiet = diet;
            
            document.querySelectorAll('#diet-plan .diet-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            event.target.classList.add('selected');
            
            updateDietRecommendations();
        }

        function updateDietRecommendations() {
            if (selectedGoal && selectedDiet && userProfile.tdee) {
                const plan = dietPlans[selectedGoal][selectedDiet];
                const targetCalories = Math.round(userProfile.tdee + plan.dailyCalories);
                
                const content = `
                    <div style="background: linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 254, 0.1)); padding: 25px; border-radius: 15px; margin-bottom: 25px;">
                        <h3 style="color: #4facfe; margin-bottom: 15px; font-weight: 700;">📊 Your Daily Requirements</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                            <div style="text-align: center;">
                                <div style="font-size: 2rem; font-weight: 800; color: #4facfe;">${targetCalories}</div>
                                <div style="color: #666;">Target Calories/Day</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 2rem; font-weight: 800; color: #667eea;">${Math.round(targetCalories * 0.25 / 4)}g</div>
                                <div style="color: #666;">Protein Goal</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 2rem; font-weight: 800; color: #764ba2;">${Math.round(targetCalories * 0.5 / 4)}g</div>
                                <div style="color: #666;">Carbs Goal</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 15px; border-left: 5px solid #4facfe;">
                        <h4 style="color: #333; margin-bottom: 15px; font-weight: 600;">🎯 ${selectedGoal.replace('-', ' ').toUpperCase()} | ${selectedDiet.replace('-', ' ').toUpperCase()}</h4>
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px; font-size: 1.1rem;">${plan.description}</p>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                            <div style="background: rgba(79, 172, 254, 0.05); padding: 15px; border-radius: 10px;">
                                <h5 style="color: #4facfe; margin-bottom: 10px;">🌅 Breakfast Options</h5>
                                ${plan.meals.breakfast.map(meal => `<p style="margin: 5px 0; color: #555;">• ${meal}</p>`).join('')}
                            </div>
                            <div style="background: rgba(102, 126, 234, 0.05); padding: 15px; border-radius: 10px;">
                                <h5 style="color: #667eea; margin-bottom: 10px;">☀️ Lunch Options</h5>
                                ${plan.meals.lunch.map(meal => `<p style="margin: 5px 0; color: #555;">• ${meal}</p>`).join('')}
                            </div>
                            <div style="background: rgba(118, 75, 162, 0.05); padding: 15px; border-radius: 10px;">
                                <h5 style="color: #764ba2; margin-bottom: 10px;">🌙 Dinner Options</h5>
                                ${plan.meals.dinner.map(meal => `<p style="margin: 5px 0; color: #555;">• ${meal}</p>`).join('')}
                            </div>
                            <div style="background: rgba(0, 242, 254, 0.05); padding: 15px; border-radius: 10px;">
                                <h5 style="color: #00f2fe; margin-bottom: 10px;">🍎 Snack Options</h5>
                                ${plan.meals.snacks.map(meal => `<p style="margin: 5px 0; color: #555;">• ${meal}</p>`).join('')}
                            </div>
                        </div>
                    </div>
                `;
                
                document.getElementById('diet-content').innerHTML = content;
                document.getElementById('diet-recommendations').style.display = 'block';
                document.getElementById('diet-recommendations').style.animation = 'fadeIn 0.8s ease';
            }
        }

        function generateWeeklyPlan() {
            if (!selectedGoal || !selectedDiet || !userProfile.tdee) {
                alert('Please complete your profile and select diet preferences first!');
                return;
            }

            const plan = dietPlans[selectedGoal][selectedDiet];
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const targetCalories = Math.round(userProfile.tdee + plan.dailyCalories);
            
            let weeklyContent = '<div class="weekly-plan">';
            
            days.forEach((day, index) => {
                const breakfastCalories = Math.round(targetCalories * 0.25);
                const lunchCalories = Math.round(targetCalories * 0.35);
                const dinnerCalories = Math.round(targetCalories * 0.3);
                const snackCalories = Math.round(targetCalories * 0.1);
                
                weeklyContent += `
                    <div class="day-card">
                        <h4>${day}</h4>
                        
                        <div class="meal">
                            <h5>🌅 Breakfast</h5>
                            <p>${plan.meals.breakfast[index % plan.meals.breakfast.length]}</p>
                            <div class="calories">${breakfastCalories} kcal</div>
                        </div>
                        
                        <div class="meal">
                            <h5>☀️ Lunch</h5>
                            <p>${plan.meals.lunch[index % plan.meals.lunch.length]}</p>
                            <div class="calories">${lunchCalories} kcal</div>
                        </div>
                        
                        <div class="meal">
                            <h5>🌙 Dinner</h5>
                            <p>${plan.meals.dinner[index % plan.meals.dinner.length]}</p>
                            <div class="calories">${dinnerCalories} kcal</div>
                        </div>
                        
                        <div class="meal">
                            <h5>🍎 Snacks</h5>
                            <p>${plan.meals.snacks[index % plan.meals.snacks.length]}</p>
                            <div class="calories">${snackCalories} kcal</div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 15px; padding: 10px; background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; border-radius: 10px; font-weight: 600;">
                            Total: ${targetCalories} kcal
                        </div>
                    </div>
                `;
            });
            
            weeklyContent += '</div>';
            
            document.getElementById('weekly-plan-content').innerHTML = weeklyContent;
            
            showSection('weekly');
            document.querySelector('[onclick="showSection(\'weekly\')"]').classList.add('active');
        }

        let calcDisplay = '0';
        let previousValue = null;
        let operation = null;
        let waitingForNewValue = false;

        function updateCalculatorDisplay() {
            document.getElementById('calc-display').textContent = calcDisplay;
        }

        function appendToDisplay(value) {
            if (waitingForNewValue) {
                calcDisplay = value;
                waitingForNewValue = false;
            } else {
                calcDisplay = calcDisplay === '0' ? value : calcDisplay + value;
            }
            updateCalculatorDisplay();
        }

        function clearCalculator() {
            calcDisplay = '0';
            previousValue = null;
            operation = null;
            waitingForNewValue = false;
            updateCalculatorDisplay();
        }

        function deleteLast() {
            calcDisplay = calcDisplay.length > 1 ? calcDisplay.slice(0, -1) : '0';
            updateCalculatorDisplay();
        }

        function calculateResult() {
            const current = parseFloat(calcDisplay);
            
            if (previousValue !== null && operation !== null) {
                let result;
                switch (operation) {
                    case '+':
                        result = previousValue + current;
                        break;
                    case '-':
                        result = previousValue - current;
                        break;
                    case '*':
                        result = previousValue * current;
                        break;
                    case '/':
                        result = current !== 0 ? previousValue / current : 0;
                        break;
                    default:
                        return;
                }
                
                calcDisplay = result.toString();
                updateCalculatorDisplay();
                
                // Add visual feedback
                document.getElementById('calc-display').style.animation = 'pulse 0.3s ease';
                setTimeout(() => {
                    document.getElementById('calc-display').style.animation = '';
                }, 300);
            }
            
            previousValue = null;
            operation = null;
            waitingForNewValue = true;
        }

        function updateProgress() {
            const currentWeight = parseFloat(document.getElementById('current-weight').value);
            const targetWeight = parseFloat(document.getElementById('target-weight').value);
            
            if (!currentWeight || !targetWeight) {
                alert('Please enter both current and target weight!');
                return;
            }
            
            if (!progressData.startWeight) {
                progressData.startWeight = currentWeight;
            }
            
            progressData.currentWeight = currentWeight;
            progressData.targetWeight = targetWeight;
            
            updateProgressDisplay();
        }

        function logCalories() {
            const consumed = parseFloat(document.getElementById('calories-consumed').value);
            const burned = parseFloat(document.getElementById('calories-burned').value);
            
            if (!consumed && !burned) {
                alert('Please enter calories consumed or burned!');
                return;
            }
            
            progressData.totalCaloriesConsumed += consumed || 0;
            progressData.totalCaloriesBurned += burned || 0;
            progressData.daysTracked += 1;
            
            updateProgressDisplay();
            
            // Clear inputs
            document.getElementById('calories-consumed').value = '';
            document.getElementById('calories-burned').value = '';
        }

        function updateProgressDisplay() {
            const weightChange = progressData.currentWeight - progressData.startWeight;
            const targetChange = progressData.targetWeight - progressData.startWeight;
            const goalProgress = targetChange !== 0 ? Math.min(100, Math.abs(weightChange / targetChange) * 100) : 0;
            
            const calorieBalance = progressData.totalCaloriesConsumed - progressData.totalCaloriesBurned;
            
            document.getElementById('weight-progress').textContent = weightChange.toFixed(1);
            document.getElementById('calorie-balance').textContent = calorieBalance > 0 ? `+${calorieBalance}` : calorieBalance;
            document.getElementById('days-tracked').textContent = progressData.daysTracked;
            document.getElementById('goal-progress').textContent = `${Math.round(goalProgress)}%`;
            
            document.getElementById('weight-progress-bar').style.width = `${Math.min(100, Math.abs(weightChange) * 10)}%`;
            document.getElementById('calorie-progress-bar').style.width = `${Math.min(100, Math.max(0, 50 + (calorieBalance / 100)))}%`;
            document.getElementById('goal-progress-bar').style.width = `${goalProgress}%`;
            
            const weightElement = document.getElementById('weight-progress');
            if (weightChange > 0) {
                weightElement.style.color = selectedGoal === 'weight-gain' ? '#4facfe' : '#ff6b6b';
            } else if (weightChange < 0) {
                weightElement.style.color = selectedGoal === 'weight-loss' ? '#4facfe' : '#ff6b6b';
            } else {
                weightElement.style.color = '#4facfe';
            }
            
            const calorieElement = document.getElementById('calorie-balance');
            calorieElement.style.color = calorieBalance > 0 ? '#ff6b6b' : '#4facfe';
        }

        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    this.style.animation = 'pulse 0.3s ease';
                    setTimeout(() => {
                        this.style.animation = '';
                    }, 300);
                });
            });
            
            document.querySelectorAll('.card').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
            document.querySelectorAll('.calc-btn.operator').forEach(btn => {
                if (!btn.textContent.includes('=')) {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const op = this.textContent === '×' ? '*' : this.textContent;
                        
                        if (previousValue === null) {
                            previousValue = parseFloat(calcDisplay);
                        } else if (operation !== null && !waitingForNewValue) {
                            calculateResult();
                            previousValue = parseFloat(calcDisplay);
                        }
                        
                        operation = op;
                        waitingForNewValue = true;
                    });
                }
            });
        });