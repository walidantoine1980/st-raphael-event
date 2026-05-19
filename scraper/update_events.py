import json
import time
import os
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

def scrape_events():
    events = []
    
    # URL de l'agenda de la ville
    url = "https://www.ville-saintraphael.fr/sortir-decouvrir/agenda"
    
    print(f"Lancement de la récupération des événements sur {url}...")
    
    # Utilisation de Playwright pour contourner les blocages (Cloudflare etc.)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Simulation d'un vrai navigateur mobile
        context = browser.new_context(
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()
        
        try:
            page.goto(url, wait_until="networkidle")
            # Attendre un peu que le contenu dynamique charge
            time.sleep(3)
            
            # Récupérer le HTML final
            html_content = page.content()
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Note: Les sélecteurs ci-dessous sont génériques.
            # En production, il faut ajuster ces sélecteurs selon la structure exacte du site.
            articles = soup.select('article.event-card, .agenda-item, .card, li.event')
            
            print(f"{len(articles)} événements potentiels trouvés.")
            
            for index, item in enumerate(articles[:10]): # On limite à 10 pour l'exemple
                # Tentative d'extraction générique
                title_elem = item.select_one('h2, h3, .title, .nom')
                date_elem = item.select_one('.date, time, .horaire')
                loc_elem = item.select_one('.location, .lieu, .adresse')
                desc_elem = item.select_one('.description, .excerpt, p')
                
                title = title_elem.text.strip() if title_elem else f"Événement #{index+1}"
                time_str = date_elem.text.strip() if date_elem else "Horaires à préciser"
                location = loc_elem.text.strip() if loc_elem else "Saint-Raphaël"
                desc = desc_elem.text.strip()[:150] + "..." if desc_elem else "Détails sur le site officiel."
                
                # On formate pour notre application React
                events.append({
                    "id": 100 + index, # IDs arbitraires
                    "title": title,
                    "classification": "🎭 Culturel", # Par défaut
                    "description": desc,
                    "location": location,
                    "city": "Saint-Raphaël",
                    "zipCode": "83700",
                    "time": time_str,
                    "price": "Consultez le site",
                    "access": {
                        "parking": "Parking à proximité",
                        "transport": "Centre-ville",
                        "pmr": "✅ Sous réserve"
                    },
                    "dateGroup": "week1" # Par défaut
                })
                
        except Exception as e:
            print(f"Erreur lors du scraping : {e}")
        finally:
            browser.close()
            
    return events

if __name__ == "__main__":
    new_events = scrape_events()
    
    if new_events:
        # Chemin vers notre fichier JSON dans le projet React
        json_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'events.json')
        
        try:
            # Charger les anciens événements pour ne pas tout écraser
            with open(json_path, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
                
            # Pour l'exemple, on ajoute simplement les nouveaux à la fin
            # (Dans un vrai système, on éviterait les doublons avec les IDs)
            combined_data = existing_data + new_events
            
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(combined_data, f, ensure_ascii=False, indent=2)
                
            print(f"Succès ! {len(new_events)} événements ont été ajoutés à events.json.")
        except Exception as e:
            print(f"Erreur lors de la sauvegarde JSON : {e}")
    else:
        print("Aucun événement récupéré.")
