const { Generation, Feedback, sequelize } = require('./models');

async function test() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    const gens = await Generation.findAll();
    console.log(`Total generations: ${gens.length}`);
    for (const g of gens) {
      console.log(`ID: ${g.id}, Route: ${g.routeFrom} -> ${g.routeTo}, UserID: ${g.userId}`);
    }
    const feeds = await Feedback.findAll();
    console.log(`Total feedbacks: ${feeds.length}`);
    for (const f of feeds) {
      console.log(`ID: ${f.id}, GenerationID: ${f.generationId}, Rating: ${f.rating}`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sequelize.close();
  }
}

test();
