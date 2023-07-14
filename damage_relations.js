damage_relations = {
    "normal": {
        "double_damage_to": [],
        "half_damage_to": [
            "rock",
            "steel"
        ],
        "no_damage_to": [
            "ghost"
        ]
    },
    "fighting": {
        "double_damage_to": [
            "normal",
            "rock",
            "steel",
            "ice",
            "dark"
        ],
        "half_damage_to": [
            "flying",
            "poison",
            "bug",
            "psychic",
            "fairy"
        ],
        "no_damage_to": [
            "ghost"
        ]
    },
    "flying": {
        "double_damage_to": [
            "fighting",
            "bug",
            "grass"
        ],
        "half_damage_to": [
            "rock",
            "steel",
            "electric"
        ],
        "no_damage_to": []
    },
    "poison": {
        "double_damage_to": [
            "grass",
            "fairy"
        ],
        "half_damage_to": [
            "poison",
            "ground",
            "rock",
            "ghost"
        ],
        "no_damage_to": [
            "steel"
        ]
    },
    "ground": {
        "double_damage_to": [
            "poison",
            "rock",
            "steel",
            "fire",
            "electric"
        ],
        "half_damage_to": [
            "bug",
            "grass"
        ],
        "no_damage_to": [
            "flying"
        ]
    },
    "rock": {
        "double_damage_to": [
            "flying",
            "bug",
            "fire",
            "ice"
        ],
        "half_damage_to": [
            "fighting",
            "ground",
            "steel"
        ],
        "no_damage_to": []
    },
    "bug": {
        "double_damage_to": [
            "grass",
            "psychic",
            "dark"
        ],
        "half_damage_to": [
            "fighting",
            "flying",
            "poison",
            "ghost",
            "steel",
            "fire",
            "fairy"
        ],
        "no_damage_to": []
    },
    "ghost": {
        "double_damage_to": [
            "ghost",
            "psychic"
        ],
        "half_damage_to": [
            "dark"
        ],
        "no_damage_to": [
            "normal"
        ]
    },
    "steel": {
        "double_damage_to": [
            "rock",
            "ice",
            "fairy"
        ],
        "half_damage_to": [
            "steel",
            "fire",
            "water",
            "electric"
        ],
        "no_damage_to": []
    },
    "fire": {
        "double_damage_to": [
            "bug",
            "steel",
            "grass",
            "ice"
        ],
        "half_damage_to": [
            "rock",
            "fire",
            "water",
            "dragon"
        ],
        "no_damage_to": []
    },
    "water": {
        "double_damage_to": [
            "ground",
            "rock",
            "fire"
        ],
        "half_damage_to": [
            "water",
            "grass",
            "dragon"
        ],
        "no_damage_to": []
    },
    "grass": {
        "double_damage_to": [
            "ground",
            "rock",
            "water"
        ],
        "half_damage_to": [
            "flying",
            "poison",
            "bug",
            "steel",
            "fire",
            "grass",
            "dragon"
        ],
        "no_damage_to": []
    },
    "electric": {
        "double_damage_to": [
            "flying",
            "water"
        ],
        "half_damage_to": [
            "grass",
            "electric",
            "dragon"
        ],
        "no_damage_to": [
            "ground"
        ]
    },
    "psychic": {
        "double_damage_to": [
            "fighting",
            "poison"
        ],
        "half_damage_to": [
            "steel",
            "psychic"
        ],
        "no_damage_to": [
            "dark"
        ]
    },
    "ice": {
        "double_damage_to": [
            "flying",
            "ground",
            "grass",
            "dragon"
        ],
        "half_damage_to": [
            "steel",
            "fire",
            "water",
            "ice"
        ],
        "no_damage_to": []
    },
    "dragon": {
        "double_damage_to": [
            "dragon"
        ],
        "half_damage_to": [
            "steel"
        ],
        "no_damage_to": [
            "fairy"
        ]
    },
    "dark": {
        "double_damage_to": [
            "ghost",
            "psychic"
        ],
        "half_damage_to": [
            "fighting",
            "dark",
            "fairy"
        ],
        "no_damage_to": []
    },
    "fairy": {
        "double_damage_to": [
            "fighting",
            "dragon",
            "dark"
        ],
        "half_damage_to": [
            "poison",
            "steel",
            "fire"
        ],
        "no_damage_to": []
    }
}