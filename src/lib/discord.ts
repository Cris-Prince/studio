import 'server-only';

async function getCommands() {
    // For now, we'll use a static list of commands.
    // In a real application, you would dynamically fetch these from your bot's code.
    return [
        {
            name: 'ping',
            description: '¡Responde con Pong!',
        },
        {
            name: 'ban',
            description: 'Banea a un usuario del servidor.',
            options: [
                {
                    name: 'usuario',
                    description: 'El usuario a banear.',
                    type: 6, // USER
                    required: true,
                },
                {
                    name: 'razon',
                    description: 'La razón del baneo.',
                    type: 3, // STRING
                    required: false,
                },
            ],
        },
        {
            name: 'kick',
            description: 'Expulsa a un usuario del servidor.',
            options: [
                {
                    name: 'usuario',
                    description: 'El usuario a expulsar.',
                    type: 6, // USER
                    required: true,
                },
                {
                    name: 'razon',
                    description: 'La razón de la expulsión.',
                    type: 3, // STRING
                    required: false,
                },
            ],
        },
    ];
}

export async function deploySlashCommands() {
    const clientId = process.env.CLIENT_ID;
    const token = process.env.DISCORD_TOKEN;

    if (!clientId || !token) {
        throw new Error('Faltan las variables CLIENT_ID o DISCORD_TOKEN en el archivo .env');
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
