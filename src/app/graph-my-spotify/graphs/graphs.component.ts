import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from "chart.js";
import { TagCloudComponent } from 'angular-tag-cloud-module';
import { CloudData } from 'angular-tag-cloud-module';
import { SearchPlaylistService } from '../../services/search-playlist.service';
import { SpotifyPlaylistItem } from '../../models/playlist.model';
import { Artist, Artists } from '../../models/artist.model';

@Component({
  selector: 'app-graphs',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    TagCloudComponent
    ],
  templateUrl: './graphs.component.html',
  styleUrl: './graphs.component.scss'
})
export class GraphsComponent implements OnInit {

  playlistItemData: SpotifyPlaylistItem[] = [];
  trackPopularities: number[] = []; // Array to store track popularities
  explicitCount: number = 0; // Number of explicit songs in a playlist
  playlistLength: number = 0; 
  releaseYears: number[] = [];
  artistCounts: { [artistId: string]: number } = {};
  genreCounts: { [genre: string]: number } = {}; // Object to store genre counts

  public popularityHistogramData!: ChartConfiguration<'bar'>['data'] 
  public explicitChartData!: ChartConfiguration<'pie'>['data'] 
  public releaseDecadeHistogramData!: ChartConfiguration<'bar'>['data']
  public cloudData: CloudData[] = [];

  public popularityHistogramOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: '# songs',
          font: {
            size: 16
          }
        },
      },
      x: {
        title: {
          display: true,
          text: 'Popularity score (0-100)',
          font: {
            size: 16
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
    }   
  }

  public decadeHistogramOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: '# songs',
          font: {
            size: 16
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Decade',
          font: {
            size: 16
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }   
  }

  public explicitChartOptions: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        labels: {
            font: {
                size: 16
            }
        }
      },
      tooltip: {
        callbacks: {
          label(tooltipItem) {
            return Number(tooltipItem.formattedValue).toFixed(1) + '%'
          }
        } 
      }
    }
  };

  constructor(
    public playlistService: SearchPlaylistService,
    ) {}

  ngOnInit() {
    // Subscribe to changes in the selected playlist
    this.playlistService.selectedPlaylistSubject.subscribe((selectedPlaylist) => {
      if (selectedPlaylist) {
        // Fetch playlist items when a playlist is selected
        this.fetchPlaylistItems(selectedPlaylist);
      } else {
        console.log("No playlist selected");
      }
    });
  }

  fetchPlaylistItems(playlistId: string) {
    // Clear existing data in case new playlist is selected
    this.playlistItemData = [];
    this.trackPopularities = [];
    this.explicitCount = 0;
    this.playlistLength = 0;
    this.releaseYears = [];
    this.artistCounts = {};
    this.genreCounts = {};
    this.cloudData = [];

    this.playlistService.getPlaylistItems(playlistId).subscribe((data) => {
      console.log("Playlist items", data);
      console.log("items", data.items);
      // Append the items to the playlistItemData array
      this.playlistItemData.push(...data.items);

      // Check if there are more items available
      if (data.next) {
        // If next URL is available, fetch the next set of items
        this.fetchNextItems(data.next);
      } else {
        console.log("playlist item count", this.playlistItemData.length)
        this.playlistLength = this.playlistItemData.length;
        this.extractData();
      }
      
    });
  }

  fetchNextItems(nextUrl: string) {
    // Fetch the next set of items using the next URL
    this.playlistService.fetchNextItems(nextUrl).subscribe((data) => {
      console.log("Next playlist items", data);
      console.log("next items", data.items);
      // Append the new items to the existing playlistItemData array
      this.playlistItemData.push(...data.items);
      console.log("updated playlist items", this.playlistItemData)

      // Check if there are more items available in the next response
      if (data.next) {
        // If next URL is available, recursively fetch the next set of items
        this.fetchNextItems(data.next);
      } else {
        console.log("playlist item count", this.playlistItemData.length)
        this.playlistLength = this.playlistItemData.length;
        this.extractData();
      }
    });
  }

  extractData() {
    // Iterate over each playlist item and extract track popularity
    this.playlistItemData.forEach((item) => {
      if (item.track) {
        this.trackPopularities.push(item.track.popularity);
        if (item.track.explicit == true){
          this.explicitCount += 1;
        }
        if (item.track.album){
          this.releaseYears.push(Number(item.track.album.release_date.split("-")[0]))
        }

        item.track.artists.forEach((artist: Artist) => {
          const artistId = artist.id;
          this.artistCounts[artistId] = (this.artistCounts[artistId] || 0) + 1;
      });

      }
    });
    console.log("Track Popularities", this.trackPopularities);
    console.log("Explicit count", this.explicitCount)
    console.log("release years", this.releaseYears)
    console.log("artists", this.artistCounts)
    
    this.generatePopulairtyHistogram();
    this.generateExplicitChart();
    this.generateReleaseDecadeHistogram();
    this.generateGenreChart();
  }

  generatePopulairtyHistogram() {
    // Initialize an array to hold the histogram data
     const histogramData = Array.from({ length: 10 }, () => 0); // 10 bins for 0-100 range
  
    // Group track popularities into bins of size 10
    this.trackPopularities.forEach((popularity) => {
      const binIndex = Math.floor(popularity / 10); // Calculate the bin index
      histogramData[binIndex]++; // Increment the frequency of the corresponding bin
    });
  
    console.log("Histogram Data", histogramData);
    // Update popularityHistogramData
    this.popularityHistogramData = {
      labels: ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99'],
      datasets: [
        {
          data: histogramData,
          label: 'Popularity Frequency',
          backgroundColor: 'rgba(240, 56, 167)'
        }
      ]
    };
    console.log("updated pop data obj", this.popularityHistogramData)
  }

  generateExplicitChart(){
    this.explicitChartData = {
      labels: ['Explicit', 'Clean'],
      datasets: [
        {
          data: [(this.explicitCount/this.playlistLength)*100,(1-(this.explicitCount/this.playlistLength))*100],
          // label: '%',
          backgroundColor: [
            'rgba(252, 71, 49)', // Color for "Explicit"
            'rgba(29, 185, 84)' // Color for "Clean"
          ]
        }
      ]
    };
    console.log("updated explicit data obj", this.explicitChartData)
  }

  generateReleaseDecadeHistogram(){
        // Find the earliest and latest release years in the playlist
        const minYear = Math.min(...this.releaseYears);
        const maxYear = Math.max(...this.releaseYears);
        // Calculate the starting decade based on the minimum year
        const startDecade = Math.floor(minYear / 10) * 10;
        // Calculate the number of decades
        const numDecades = Math.ceil((maxYear - startDecade + 1) / 10);

        // Initialize an array to hold the histogram data
        const histogramData = Array.from({ length: numDecades }, () => 0);
  
        // Group track popularities into bins of size 10
        this.releaseYears.forEach((year) => {
          const binIndex = Math.floor((year - startDecade) / 10); // Calculate the bin index relative to the minimum year
          histogramData[binIndex]++; // Increment the frequency of the corresponding bin
      });
      
        console.log("Histogram Data", histogramData);
        // Update releaseDecadeHistogramData
        this.releaseDecadeHistogramData = {
          labels: Array.from({ length: numDecades }, (_, i) => `${startDecade + i * 10}-${startDecade + (i + 1) * 10 - 1}`),
          datasets: [
            {
              data: histogramData,
              label: 'Decade Frequency',
              backgroundColor: 'rgba(63, 4, 244)'
            }
          ]
        };
        console.log("updated pop data obj", this.releaseDecadeHistogramData)
  }

  generateGenreChart() {
    // Clear the cloudData array
    this.cloudData = [];

    // Extract genres from artist info
    const artistIds = Object.keys(this.artistCounts);
    const batchSize = 50;

    // Get artist infos by batches
    for (let i = 0; i < artistIds.length; i += batchSize) {
        const batch = artistIds.slice(i, i + batchSize).join(',');
        this.fetchArtistInfo(batch);
    }
}

  fetchArtistInfo(artistIds: string) {
    this.playlistService.getArtistsInfo(artistIds).subscribe((data: Artists) => {
        data.artists.forEach((artist) => {
            // Get the count of appearances for the current artist to weight the genre
            const artistCount = this.artistCounts[artist.id];
            artist.genres.forEach((genre) => {
                this.genreCounts[genre] = (this.genreCounts[genre] || 0) + artistCount;
            });
        });

        // Populate cloudData
        for (const genre in this.genreCounts) {
          // Check if the genre already exists in cloudData
          const existingGenreIndex = this.cloudData.findIndex(item => item.text.toLowerCase() === genre.toLowerCase());
          if (existingGenreIndex !== -1) {
              // If the genre exists, update its weight
              this.cloudData[existingGenreIndex].weight += this.genreCounts[genre];
          } else {
              // Otherwise, add it to the list
              this.cloudData.push({ text: genre, weight: this.genreCounts[genre] });

          }
      }
      // Make sure data is updated with new ref so that the chart will detect a change
      this.cloudData = [ ...this.cloudData]
      console.log("cloudData", this.cloudData);
    });
  }
  
}
