import * as Print from "expo-print";

export const generateRecipePDF = async (recipe: any) => {
  const ingredientsHtml = recipe.recipe_ingredients
    .map(
      (ing: any) =>
        `<li>${ing.quantity || ""} ${ing.unit || ""} ${ing.name}</li>`,
    )
    .join("");

  const stepsHtml = recipe.recipe_steps
    .map(
      (step: any) =>
        `<div class="step">
          <h3>Step ${step.step_number}</h3>
          <p>${step.description}</p>
        </div>`,
    )
    .join("");

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
          h1 { font-size: 32px; margin-bottom: 10px; color: #000; }
          .meta { color: #666; font-size: 14px; margin-bottom: 30px; }
          h2 { border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px; }
          ul { line-height: 1.6; }
          .step { margin-bottom: 20px; }
          .step h3 { margin: 0 0 5px 0; font-size: 16px; color: #555; }
          .step p { margin: 0; }
          img { width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        ${recipe.image ? `<img src="${recipe.image}" />` : ""}
        <h1>${recipe.title}</h1>
        <div class="meta">
          ${recipe.cook_time ? `<span>⏱ ${recipe.cook_time} min</span> • ` : ""}
          ${recipe.cuisine ? `<span>🌍 ${recipe.cuisine}</span>` : ""}
        </div>

        <h2>Ingredients</h2>
        <ul>
          ${ingredientsHtml}
        </ul>

        <h2>Instructions</h2>
        ${stepsHtml}
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  return uri;
};
