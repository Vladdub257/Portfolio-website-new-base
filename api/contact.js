// api/contact.js

const { Client } = require('@notionhq/client');

const notion = new Client({
    auth: process.env.NOTION_TOKEN
});

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

const allowedProjectTypes = [
    'Landing page',
    'Small business website',
    'Portfolio website',
    'Simple web application',
    'Website update',
    'Not sure yet'
];

const allowedBudgets = [
    'Prefer not to say',
    'Free example page',
    'Around 50 €',
    '100–200 €',
    '200–500 €',
    'Over 500 €'
];

function sanitizeText(value, maxLength) {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLength);
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        if (!process.env.NOTION_TOKEN || !NOTION_DATABASE_ID) {
            return res.status(500).json({
                success: false,
                message: 'Server configuration error'
            });
        }

        const name = sanitizeText(req.body.name, 120);
        const email = sanitizeText(req.body.email, 180);
        const projectType = sanitizeText(req.body.projectType, 80);
        const budget = sanitizeText(req.body.budget, 80) || 'Prefer not to say';
        const description = sanitizeText(req.body.description, 2000);

        if (!name || !email || !projectType || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        if (!email.includes('@')) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        if (!allowedProjectTypes.includes(projectType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project type'
            });
        }

        if (!allowedBudgets.includes(budget)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid budget range'
            });
        }

        await notion.pages.create({
            parent: {
                database_id: NOTION_DATABASE_ID
            },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: name
                            }
                        }
                    ]
                },
                Email: {
                    email: email
                },
                'Project Type': {
                    select: {
                        name: projectType
                    }
                },
                Budget: {
                    select: {
                        name: budget
                    }
                },
                Description: {
                    rich_text: [
                        {
                            text: {
                                content: description
                            }
                        }
                    ]
                },
                Status: {
                    select: {
                        name: 'New'
                    }
                },
                Created: {
                    date: {
                        start: new Date().toISOString()
                    }
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Inquiry saved successfully'
        });
    } catch (error) {
        console.error('Notion submission error:', error);

        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to save inquiry',
            code: error.code || null,
            status: error.status || null
        });
    }
};