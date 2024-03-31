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
  
  public popularityHistogramData!: ChartConfiguration<'bar'>['data'] 

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
        this.extractTrackPopularities();
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
        this.extractTrackPopularities();
      }
    });
  }

  extractTrackPopularities() {
    // Iterate over each playlist item and extract track popularity
    this.playlistItemData.forEach((item) => {
      if (item.track) {
        this.trackPopularities.push(item.track.popularity);
      }
    });
    console.log("Track Popularities", this.trackPopularities);
    
    this.generateHistogram()
  }

  generateHistogram() {
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
    console.log("updated data obj", this.popularityHistogramData)
  }
  
}
