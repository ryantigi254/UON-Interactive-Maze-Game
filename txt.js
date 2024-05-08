

let enemies = document.querySelectorAll('.enemy');

enemies.forEach(enemy => {
    enemy.classList.add("MoveBottom")
})

function RandomMovementTimer() {
    enemies.forEach(enemy => {
        enemy.classList.remove("MoveLeft");
        enemy.classList.remove("MoveTop");
        enemy.classList.remove("MoveRight");
        enemy.classList.remove("MoveBottom");

        const randomNum = Math.floor(Math.random() * 4) + 1;

        // Use a switch-case statement to perform actions based on the random number
        switch (randomNum) {
            case 1:
                // for case 1 enemy moves left
                enemy.classList.add("MoveLeft")

            case 2:
                // for case 2 enemy moves Top
                enemy.classList.add("MoveTop");

            case 3:
                // for case 3 enemy moves Right
                enemy.classList.add("MoveRight")

            case 4:
                // for case 4 enemy moves Bottom
                enemy.classList.add("MoveBottom")

        }
    })
}


let difficultyprompt = 5
// let difficultyprompt = parseInt(window.prompt("Choose a difficulty from 1 to 5:(default will always be 1)"), 10);
let difficulty = 3;


function enemyMovement() {
    if (playerCanMove == false)
        return;
    // console.log("hello")

    enemies.forEach(enemy => {
        let enemyposition = enemy.getBoundingClientRect()


        // these will be coordinates for the next position of the enemy
        let next = 5;
        let nextTOP = enemyposition.top - next
        let nextLEFT = enemyposition.left - next
        let nextBOTTOM = enemyposition.top + enemyposition.height + next
        let nextRIGHT = enemyposition.left + enemyposition.width + next

        // these are the current coordinates
        let x = enemyposition.left
        let y = enemyposition.top


        // this is for storing the current style coordinate of the enemy
        let movementX = parseInt(enemy.style.left, 10)
        let movementY = parseInt(enemy.style.top, 10)

        if (isNaN(movementX)) {
            movementX = 0
        }
        if (isNaN(movementY)) {
            movementY = 0
        }

        // this will make sure that both top right and top left are checked for wall to ensure fair collision and similar with all 4 directions
        let coordinateTopRight = document.elementFromPoint(x + (enemyposition.width), nextTOP)
        let coordinateTopLeft = document.elementFromPoint(x, nextTOP)

        let coordinateLeftUp = document.elementFromPoint(nextLEFT, y + (enemyposition.height))
        let coordinateLeftDown = document.elementFromPoint(nextLEFT, y)

        let coordinateBottomRight = document.elementFromPoint(x + (enemyposition.width), nextBOTTOM)
        let coordinateBottomLeft = document.elementFromPoint(x, nextBOTTOM)

        let coordinateRightUp = document.elementFromPoint(nextRIGHT, y + (enemyposition.height))
        let coordinateRightDown = document.elementFromPoint(nextRIGHT, y)


        function reset() {
            if (!coordinateLeftUp.classList.contains("wall") && !coordinateLeftDown.classList.contains("wall")) {
                enemy.classList.add("MoveLeft")
                movementX -= difficulty;
                enemy.style.left = movementX + "px"

            } else if (!coordinateTopRight.classList.contains("wall") && !coordinateTopLeft.classList.contains("wall")) {
                enemy.classList.add("MoveTop");
                movementY -= difficulty;
                enemy.style.top = movementY + "px";

            } else if (!coordinateRightUp.classList.contains("wall") && !coordinateRightDown.classList.contains("wall")) {
                enemy.classList.add("MoveRight")
                movementX += difficulty;
                enemy.style.left = movementX + "px"
            } else {
                enemy.classList.add("MoveBottom")
                movementY += difficulty;
                enemy.style.top = movementY + "px"
            }
        }


        function RandomMovement() {

            const randomNumber = Math.floor(Math.random() * 4) + 1;

            // Use a switch-case statement to perform actions based on the random number
            switch (randomNumber) {
                case 1:
                    // for case 1 enemy moves left
                    if (!coordinateLeftUp.classList.contains("wall") && !coordinateLeftDown.classList.contains("wall")) {
                        enemy.classList.add("MoveLeft")
                        movementX -= difficulty;
                        enemy.style.left = movementX + "px"
                    } else {
                        reset()
                    }
                    ;
                case 2:
                    // for case 2 enemy moves Top
                    if (!coordinateTopRight.classList.contains("wall") && !coordinateTopLeft.classList.contains("wall")) {
                        enemy.classList.add("MoveTop");
                        movementY -= difficulty;
                        enemy.style.top = movementY + "px";
                    } else {
                        reset()
                    }
                case 3:
                    // for case 3 enemy moves Right
                    if (!coordinateRightUp.classList.contains("wall") && !coordinateRightDown.classList.contains("wall")) {
                        enemy.classList.add("MoveRight")
                        movementX += difficulty;
                        enemy.style.left = movementX + "px"
                    } else {
                        reset()
                    }
                case 4:
                    // for case 4 enemy moves Bottom
                    if (!coordinateBottomRight.classList.contains("wall") && !coordinateBottomLeft.classList.contains("wall")) {
                        enemy.classList.add("MoveBottom")
                        movementY += difficulty;
                        enemy.style.top = movementY + "px"
                    } else {
                        reset()
                    }
                    break;
            }
        }





        if (enemy.classList.contains("MoveLeft")) {
            if (!coordinateLeftUp.classList.contains("wall") && !coordinateLeftDown.classList.contains("wall")) {
                movementX -= difficulty
                enemy.style.left = movementX + "px"
            } else {
                enemy.classList.remove("MoveLeft");
                RandomMovement()
            }
        }

        else if (enemy.classList.contains("MoveTop")) {
            if (!coordinateTopRight.classList.contains("wall") && !coordinateTopLeft.classList.contains("wall")) {
                movementY -= difficulty
                enemy.style.top = movementY + "px"
            } else {
                enemy.classList.remove("MoveTop")
                RandomMovement()
            }
        }

        else if (enemy.classList.contains("MoveRight")) {
            if (!coordinateRightUp.classList.contains("wall") && !coordinateRightDown.classList.contains("wall")) {
                movementX += difficulty
                enemy.style.left = movementX + "px"
            } else {
                enemy.classList.remove("MoveRight")
                RandomMovement()
            }


        } else if (enemy.classList.contains("MoveBottom")) {
            if (!coordinateBottomRight.classList.contains("wall") && !coordinateBottomLeft.classList.contains("wall")) {
                movementY += difficulty;
                enemy.style.top = movementY + "px"
            } else {
                enemy.classList.remove("MoveBottom")
                RandomMovement()
            }
        }
    });
}

enemyMovementInterval = setInterval(enemyMovement, 1)
enemyRandomTimerInterval = setInterval(RandomMovementTimer, 3000)