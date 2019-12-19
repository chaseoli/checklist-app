interface IQuote {
    text: string
    author: string
}

interface ITeam {

    // team name
    name: string

    // manager = the person who creates the checklists for the staff
    manager: IPerson
    staff: {
        [id: string]: IPerson
    }

}

interface IPerson {

    // person name
    first: string
    last: string

    // work title
    title: string

    // person's goals
    goals: {
        [goal_id: string]: IGoals
    }

    // checklist
    checklists: {
        [checklist_id: string]: IChecklist
    }

}

interface IGoals {

    // GOALS should be specific, measureable, attainable, relevant, timely: 

    // SPECIFIC - give a "specific" description of the goal
    description: string // ie: earn certificate from MIT-X for python

    // MEASUREABLE - other measures
    measures: {
        [measure_id: string]: {

            // measures can be either completed or not
            completed: boolean

            // measures can be percent complete
            at: number // current value ie: completed 3 classes so far
            of: number // total possible value ie: total of 18 classes to complete certification

        };
    }

    // RELEVANT - description of the why and importance driving the achievement of the  goal, the bigger picture
    relevance: string;

    // TIMELY - timestamp when to complete the goal (short-term vs. long-term calculated )
    due: number

    // goal completed
    achieved: boolean

    // who can see your task status
    privacy:
    'private' | // only visible 
    'public' |
    'supervisor-only'

}

interface IChecklist {

    // name of the checklist
    title: string

    // created by self
    assigned_self: boolean

    // who assigned this checklist to the person (assigned_self = true)
    assigned_by?: IPerson

    // ie: daily, workdays, etc. 
    recurrence: string // ISO description describing recurring event 

    // who can see your task status
    privacy:
    'private' | // only visible 
    'public' |
    'supervisor-only'

    // collection of tasks
    tasks: {
        [task_id: string]: ITask
    }

    // comments that a staff member may request to to update the checklist set of tasks
    reviews: {
        [threads_id: number]: {
            // if the comment has been addressed
            resolved: boolean
            [order: number]: {
                // by = author creating the review note
                author: IPerson
                // description of the requested change
                comment: string
            }
        }

    }

}

interface ITask {

    // describe the work effort
    description: string

    // helps in ordering which tasks to do first
    priority: 'high' | 'normal' | 'low'

    // timestamp when to recieve a reminder/alert 
    alert: string

    // duration - see naming convention per moment.js durations
    duration: string // 15m, 30m, 45m, 1hr, 2hr etc.

    // unix-timestamp - start and end are dynamically set 
    // from reading calendar and reading priority and finding an appropriate timeslot
    start: number
    end: string

    // DECIDED NOT TO CATEGORIZE BY PERSONAL VS. WORK because everything is personal
    // instead there is a private vs. public flag
    // tag if the priority is work or personal
    // type: 'personal' | 'work'

    // task completed
    done: boolean

    // EVIDENCE - supporting evidence of completion of the task
    // if true then evidence is required
    ev_req: boolean
    ev_url: string // link to image
    ev_value: string // result of the task being completed (ie: description of output/feedback/outcome)  

}