
function importPokemon(importField, statTypes, statFields, typeFields)
{
    stats = pokemon_stats[document.getElementById(importField).value];
    types = pokemon_types[document.getElementById(importField).value];

    for (i = 0; i < statTypes.length; i++)
    {
        document.getElementById(statFields[i]).value = stats[statTypes[i]];
    }

    for (i = 0; i < typeFields.length; i++)
    {
        document.getElementById(typeFields[i]).value = types[i];
        if (i+1 > types.length) {
            document.getElementById(typeFields[i]).value = "(none)";
        }
    }

    importMove(['attackType1', 'attackType2'], ['targetType1', 'targetType2'])
}

function importMove(attackTypes, targetTypes)
{
    move = move_stats[document.getElementById("importMoveMenu").value];

    try 
    {
    document.getElementById("moveType").value = move["type"];
    document.getElementById("moveCategory").value = move["category"];
    document.getElementById("movePower").value = move["power"];
    document.getElementById("STAB").checked = false;
    } catch {}

    for (i = 0; i < attackTypes.length; i++)
    {
        if (document.getElementById(attackTypes[i]).value == move["type"])
        {
            document.getElementById("STAB").checked = true;
            break;
        }
    }

    effectiveness = document.getElementById("typeEffective"); 
    currentEffective = 1;

    for (var targetType of targetTypes)
    {
        currentType = document.getElementById(targetType).value;
        for (var double_damage_type of damage_relations[move["type"]]["double_damage_to"]) if (currentType === double_damage_type) currentEffective *= 2;
        for (var half_damage_type of damage_relations[move["type"]]["half_damage_to"]) if (currentType === half_damage_type) currentEffective *= 0.5;
        for (var no_damage_type of damage_relations[move["type"]]["no_damage_to"]) if (currentType === no_damage_type) currentEffective *= 0;
    }

    effectiveness.value = currentEffective.toString();
}

window.onload = async function() 
{

    // pokemon -------------------------------------------
    targetMenu = document.getElementById("importTargetMenu");
    attackMenu = document.getElementById("importAttackMenu");

    for (i = 0; i < pokemon_list.length; i++)
    {
        option = new Option();
        option.value = pokemon_list[i];
        option.text = titleCase(pokemon_list[i]);
        targetMenu.add(option);
    }
    attackMenu.innerHTML += targetMenu.innerHTML;

    // moves   -------------------------------------------
    moveMenu = document.getElementById("importMoveMenu");

    for (i = 0; i < move_list.length; i++)
    {
        option = new Option();
        option.value = option.text = move_list[i];
        moveMenu.add(option);
    }

    // natures -------------------------------------------
    targetNatureMenu = document.getElementById("targetNatureMenu");
    attackNatureMenu = document.getElementById("attackNatureMenu");

    for (i = 0; i < nature_list.length; i++)
    {
        option = new Option();
        option.value = option.text = nature_list[i];
        targetNatureMenu.add(option);
    }
    attackNatureMenu.innerHTML += targetNatureMenu.innerHTML;

    // items   -------------------------------------------
    targetItemMenu = document.getElementById("targetItemMenu");
    attackItemMenu = document.getElementById("attackItemMenu");

    for (i = 0; i < item_list.length; i++)
    {
        option = new Option();
        option.value = option.text = item_list[i];
        targetItemMenu.add(option);
    }
    attackItemMenu.innerHTML += targetItemMenu.innerHTML;
}

// titlecase function 
function titleCase(str) {
    newName = str.charAt(0).toUpperCase();
    for (j = 0; j < str.length-1; j++)
    {
        if (str.charAt(j) === " " || str.charAt(j) === "-") 
        {
            newName += str.charAt(j+1).toUpperCase();
        } 
        else
        {
            newName += str.charAt(j+1)
        }
    }
    return newName;
}

// DEPRECATED

// function pokemonViable(name)
// {
//     suffixes = [
//         "-gmax", "-star", "-belle", "-phd", "-cap", "-libre", "-starter",
//         "-construct", "-totem", "-tempo", "-build", "-mode", "-plumage", "-roaming", 
//         "-three", "-segment", "-cosplay"
//     ];
//     if (name.includes("totem"))
//     {
//         return false;
//     }
//     for (ii = 0; ii < suffixes.length; ii++)
//     {
//         if (name.endsWith(suffixes[ii]))
//         {
//             return false;
//         }
//     }
//     return true;
// }

// function itemViable(category)
// {
//     categories = [
//         "standard-balls", "special-balls", "healing", "status-cures", "revival", "pp-recovery",
//         "vitamins", "stat-boosts", "spelunking", "flutes", "evolution", "loot", "collectibles",
//         "dex-completion", "mulch", "all-mail", "baking-only", "effort-drop", "effort-training",
//         "training", "scarves", "all-machines", "gameplay", "unused", "event-items", "plot-advancement",
//         "apricorn-balls", "apricorn-box", "data-cards", "jewels", "miracle-shooter", "mega-stones",
//         "memories", "z-crystals", "species-specific", "medicine", "other", "picky-healing", "in-a-pinch"
//     ];
//     for (ii = 0; ii < categories.length; ii++)
//     {
//         if (category === categories[ii])
//         {
//             return false;
//         }
//     }
//     return true;
// }

