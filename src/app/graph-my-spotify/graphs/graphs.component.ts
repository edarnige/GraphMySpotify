import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { SearchPlaylistService } from '../../services/search-playlist.service';
import { SpotifyPlaylist, SpotifyPlaylistItem } from '../../models/playlist.model';


@Component({
  selector: 'app-graphs',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule
    ],
  templateUrl: './graphs.component.html',
  styleUrl: './graphs.component.scss'
})
export class GraphsComponent implements OnInit {

  playlistItemData: any[] = [];
  trackPopularities: number[] = []; // Array to store track popularities
  explicitCount: number = 0; // Number of explicit songs in a playlist
  playlistLength: number = 0; 
  releaseYears: number[] = [];
  
  public popularityHistogramData!: ChartConfiguration<'bar'>['data'] 
  public explicitChartData!: ChartConfiguration<'pie'>['data'] 
  public releaseDecadeHistogramData!: ChartConfiguration<'bar'>['data']

  constructor(
    public playlistService: SearchPlaylistService,
    ) {}

  ngOnInit() {
    // Subscribe to changes in the selected playlist
    this.playlistService.selectedPlaylistSubject.subscribe((selectedPlaylist) => { // Need to run every time submit is clicked
      if (selectedPlaylist) {
        // Fetch playlist items when a playlist is selected
        this.fetchPlaylistItems(selectedPlaylist);
      } else {
        console.log("No playlist selected");
      }
    });
  }

  fetchPlaylistItems(playlistId: string) {
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
      }
    });
    console.log("Track Popularities", this.trackPopularities);
    console.log("Explicit count", this.explicitCount)
    console.log("release years", this.releaseYears)
    
    this.generatePopulairtyHistogram();
    this.generateExplicitChart();
    this.generateReleaseDecadeHistogram();
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
          label: 'Popularity Frequency'
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
          data: [(this.explicitCount/this.playlistLength),1-(this.explicitCount/this.playlistLength)],
          label: 'explicitness'
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
              label: 'Decade Frequency'
            }
          ]
        };
        console.log("updated pop data obj", this.releaseDecadeHistogramData)
  }
  
}
