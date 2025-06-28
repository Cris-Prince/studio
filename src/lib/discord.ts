import 'server-only';

async function getCommands() {
    // For now, we'll use a static list of commands.
    // In a real application, you would dynamically fetch these from your bot's code.
    return [
        {
            name: 'ping',
            description: 'Replies with Pong!',
        },
    ];
}

export async function deploySlashCommands() {
    const clientId = process.env.CLIENT_ID;
    const token = process.env.DISCORD_TOKEN;

    if (!clientId || !token) {
        throw new Error('Missing CLIENT_ID or DISCORD_TOKEN in .env file');
    }

    const commands = await getCommands();
    const url = `https://discord.com/api/v10/applications/${clientId}/commands`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bot ${token}`,
        },
        method: 'PUT',
        body: JSON.stringify(commands),
    });

    if (response.ok) {
        console.log('Successfully registered application commands.');
        const data = await response.json();
        console.log(data);
    } else {
        console.error('Error registering application commands:');
        const error = await response.text();
        console.error(error);
        throw new Error(`Failed to deploy commands: ${response.status} ${response.statusText} - ${error}`);
    }
}
