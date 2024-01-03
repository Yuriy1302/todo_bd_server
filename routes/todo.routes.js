const { Router } = require("express");

const router = Router();

const db = require("../db");
const authMiddleware = require("../middleware/auth.middleware");

// Получение списков
router.get("/", authMiddleware, async (req, res) => {
    try {
        const { userId } = req.user;
        
        const lists = await db.query('SELECT * FROM lists WHERE user_id = $1', [userId]);

        const modifyList = lists.rows.map((list) => ({
            listId: list._id,
            title: list.list_title,
            userId: list.user_id,
            completed: list.completed
        }));

        res.status(200).json({ lists: modifyList });
    } catch (err) {
        console.error('err >>> ', err);
        res.status(400).json({ message: "Что-то пошло не так при получении списка задач." });
    }
});

// Получение задач по id списка
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const { userId } = req.user;

        if (!userId) {
            return res.status(400).json({ error: 'Ooops! Не смог получить userId.'});
        }
    
        const listId = req.params.id;
    
        const tasks = await db.query('SELECT * FROM tasks WHERE list_id = $1', [listId]);
    
        console.log('tasks >>> ', tasks.rows);   
        
        const modifyTasks = tasks.rows.map((task) => ({
            taskId: task._id,
            text: task.text,
            done: task.done
        }));

        res.status(200).json({ tasks: modifyTasks, listId });
    } catch (err) {
        console.error('err >>> ', err);
    }
});

// Запись списка
router.post("/", authMiddleware, async (req, res) => {
    try {

        const { userId } = req.user;

        if (!userId) {
            return res.status(400).json({ error: 'Ooops! Не смог получить userId.'});
        }

        const { listTitle, tasks } = req.body;

        // console.log('listTitle and tasks ', listTitle, " + ", tasks);

        const listId = await db.query(
            'INSERT INTO lists (list_title, user_id) VALUES ($1, $2) RETURNING _id',
            [listTitle, userId]
        );

        for (let i = 0; i < tasks.length; i += 1) {
            await db.query(
                'INSERT INTO tasks (text, list_id) VALUES($1, $2)',
                [tasks[i].text, listId.rows[0]._id]
            );
        }

        const newTasks = await db.query('SELECT COUNT(*) FROM tasks WHERE list_id = $1', [listId.rows[0]._id]);

        if (Number(newTasks.rows[0].count) !== tasks.length) {
            console.log("Что-то пошло не так в сравнении длины списксов задач.");
            return res.status(400).json({ message: "Что-то пошло не так." });
        }

        res.json({ message: "Список задач сохранен.", tasks: newTasks.rows[0] });

    } catch (err) {
        console.error('err >>> ', err);
        res.status(400).json({ message: "Something went wrong Add list & tasks" });
    }
});


// Удаление списка с задачами
router.delete("/:id", authMiddleware, async (req, res) => {
    try {

        const { userId } = req.user;

        if (!userId) {
            return res.status(400).json({ error: 'Ooops! Не смог получить userId.'});
        }

        const listId = req.params.id;

        console.log('id in delete params => ', listId);

        await db.query('DELETE FROM tasks WHERE list_id = $1', [listId]);
        const result = await db.query('DELETE FROM lists WHERE _id = $1', [listId]);

        // Проверить при ошибке
        // { ... severity: 'ERROR', }

        const check = await db.query('SELECT * FROM lists WHERE _id = $1', [listId]);

        console.log('delete result => ', result);

        console.log('check => ', check.rows);


        res.json({ message: "Список с задачами удален" });



        
    } catch (err) {
        console.error('err >>> ', err);
        res.status(400).json({ message: "Something went wrong in Deleting list & tasks" });
    }
})



module.exports = router;
