export default (client) => {
  client.once('ready', () => {
    console.log(`${client.user.tag} ready`);
  });
};
